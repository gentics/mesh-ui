
module meshAdminUi {


    interface IImportResult {
        fileName: string;
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
                    private schemaValidatorService: SchemaValidatorService) {
        }

        /**
         * Download each of the selected schemas as a .json file.
         */
        public exportSelected(schemas: (ISchema|IMicroschema)[], selected: any) {
            schemas.filter(schema => {
                    return selected[schema.uuid];
                })
                .map(schema => {
                    let schemaClone = angular.copy(schema);
                    delete schemaClone.uuid;
                    delete schemaClone.permissions;
                    return schemaClone;
                })
                .forEach(schema => {
                    this.downloadFile(schema.name + '.json', JSON.stringify(schema, null, 4));
                })
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
                let deferred = this.$q.defer();
                let reader = new FileReader();
                reader.onload = () => {
                    deferred.resolve({
                        content: reader.result,
                        fileName: file.name
                    });
                };
                reader.readAsText(file);
                return deferred.promise;
            });

            return this.$q.all(promises);
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
                    errors.push(result.fileName + ': File must be have .json extension');
                    return false;
                }
                validateFn(result.content, (msg) => {
                    errors.push(result.fileName + ': ' + msg);
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
