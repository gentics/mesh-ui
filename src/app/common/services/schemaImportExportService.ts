
module meshAdminUi {


    interface IImportResult {
        fileName: string;
        schemaName: string;
        content: string;
    }

    enum Type {
        Schema,
        Microschema
    }

    /**
     * Service used to import and export schemas and microschemas in .json format.
     */
    export class SchemaImportExportService {

        constructor(private dataService: DataService,
                    private $q: ng.IQService,
                    private mu: MeshUtils,
                    private schemaValidatorService: SchemaValidatorService) {
        }

        /**
         * Download each of the selected schemas as a .json bundle.
         */
        public exportSelected(filename: string,
                              schemas: Array<ISchema|IMicroschema>,
                              selected: { [uuid: string]: boolean }) {
            let bundle = schemas
                .filter(schema => selected[schema.uuid])
                .map(schema => {
                    let schemaClone = angular.copy(schema);
                    delete schemaClone.uuid;
                    delete schemaClone.permissions;
                    return schemaClone;
                })
                .reduce((arr: ISchema[], schema: ISchema) => {
                    arr.push(schema);
                    return arr;
                }, []);

            // sort by schema name
            bundle.sort((a, b) => {
                if (a.name < b.name) {
                    return -1;
                }
                if (a.name > b.name) {
                    return 1;
                }
                return 0;
            });

            // if there is only a single schema in the bundle, extract it from the array
            if (bundle.length === 1) {
                bundle = bundle[0];
            }

            this.downloadFile(filename + '.json', JSON.stringify(bundle, null, 4));
        }

        /**
         * Trigger a browser download of arbitrary text content, from http://stackoverflow.com/a/18197341/772859
         */
        private downloadFile(filename: string, text: string) {
            var element = document.createElement('a');
            element.setAttribute('href', 'data:text/plain;charset=utf-8,' + encodeURIComponent(text));
            element.setAttribute('download', filename);

            element.style.display = 'none';
            document.body.appendChild(element);

            element.click();

            document.body.removeChild(element);
        }

        public importSchemas(files: File[], onErrors: (errors: string[]) => any): ng.IPromise<any> {
            return this.processImport(Type.Schema, files, onErrors);
        }

        public importMicroschemas(files: File[], onErrors: (errors: string[]) => any): ng.IPromise<any> {
            return this.processImport(Type.Microschema, files, onErrors);
        }

        /**
         * Get the content of the selected files, validate it as a valid schema, and then POST to Mesh.
         */
        private processImport(type: Type, files: File[], onErrors: (errors: string[]) => any): ng.IPromise<any> {

            return this.getFileTextContents(files)
                .then(results => this.validateImports(type, results, onErrors))
                .then(validResults => {
                    let promises = validResults.map(result => {
                        return this.persistToMesh(type, result.content);
                    });
                    return this.$q.all(promises);
                });
        }

        /**
         * Given an array of File objects, reads their contents and returns and array of results.
         */
        private getFileTextContents(files: File[]): ng.IPromise<IImportResult[]> {
            if (!files || files.length === 0) {
                return this.$q.when([]);
            }

            let promises = files.map(file => {
                let reader = new FileReader();
                let deferred = this.$q.defer();

                reader.onload = () => {
                    let schemas = this.fileContentsToSchemaArray(reader.result);
                    deferred.resolve(schemas.map(s => {
                        return {
                            content: JSON.stringify(s),
                            schemaName: s.name,
                            fileName: file.name
                        };
                    }));
                };
                reader.readAsText(file);

                return deferred.promise;
            });

            return this.$q.all(promises)
                .then(arrays => this.mu.flatten(arrays));
        }

        /**
         * Accepts a JSON string representation of either a single Schema or an array of Schemas, and returns an
         * array of Schemas.
         */
        private fileContentsToSchemaArray(contents: string): Array<ISchema|IMicroschema> {
            let jsObj = JSON.parse(contents);
            return (jsObj instanceof Array) ? jsObj : [jsObj];
        }

        /**
         * Validate the schemas of the imported JSON files.
         */
        private validateImports(type: Type, results: IImportResult[], onErrors: (errors: string[]) => any): IImportResult[] {
            let errors = [];

            const validateFn = (json, onError) => {
                if (type === Type.Schema) {
                    return this.schemaValidatorService.validateSchemaJson(json, onError);
                } else {
                    return this.schemaValidatorService.validateMichroschemaJson(json, onError);
                }
            };

            let valid = results.filter(result => {
                let isValid = true;

                if (result.fileName.indexOf('.json') === -1) {
                    errors.push(`${result.fileName}: File must be have .json extension`);
                    return false;
                }
                validateFn(result.content, (msg) => {
                    errors.push(`${result.fileName}: [${result.schemaName}] ${msg}`);
                    isValid = false;
                });
                return isValid;
            });

            if (0 < errors.length) {
                onErrors(errors);
            }
            return valid;
        }

        private persistToMesh(type: Type, json: string): ng.IPromise<any> {
            if (type === Type.Schema) {
                return this.dataService.persistSchema(JSON.parse(json));
            } else {
                return this.dataService.persistMicroschema(JSON.parse(json));
            }
        }
    }

    angular.module('meshAdminUi.common')
        .service('schemaImportExportService', SchemaImportExportService)
}
