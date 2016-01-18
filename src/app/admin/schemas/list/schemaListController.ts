module meshAdminUi {

    interface IImportResult {
        fileName: string;
        content: string;
    }

    class SchemaListController {

        public schemas: ISchema[];
        public schemaFilter: string;
        public selected: any = {};

        constructor(private dataService: DataService,
                    private $q: ng.IQService,
                    private notifyService: NotifyService,
                    private schemaValidatorService: SchemaValidatorService,
                    private mu: MeshUtils) {
            // TODO: implement paging
            dataService.getSchemas({ perPage: 10000 })
                .then(response => this.schemas = response.data);
        }

        public filterFn = (value: IUser) => {
            return this.mu.matchProps(value, ['name'], this.schemaFilter);
        };

        /**
         * Returns false if at least one schema is selected.
         */
        public selectionEmpty(): boolean {
            return 0 === Object.keys(this.selected).filter(key => this.selected[key]).length;
        }

        /**
         * Download each of the selected schemas as a .json file.
         */
        public exportSelected() {
            this.schemas.filter(schema => {
                return this.selected[schema.uuid];
            }).forEach(schema => {
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

        /**
         * Get the content of the selected files, validate it as a valid schema, and then POST to Mesh.
         */
        public processImport(files: File[]) {
            this.getFileTextContents(files)
                .then(results => this.validateImports(results))
                .then(validResults => {
                    let promises = validResults.map(result => {
                        return this.dataService.persistSchema(JSON.parse(result.content));
                    });
                    return this.$q.all(promises);
                })
                .then(results => {
                    this.notifyService.toast(`Imported ${results.length} schemas.`);
                    this.dataService.getSchemas({ perPage: 10000 })
                        .then(response => this.schemas = response.data);
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
        private validateImports(results: IImportResult[]): IImportResult[] {
            let errors = [];

            let valid = results.filter(result => {
                let isValid = true;

                if (result.fileName.indexOf('.json') === -1) {
                    errors.push(result.fileName + ': File must be have .json extension');
                    return false;
                }
                this.schemaValidatorService.validateSchemaJson(result.content, (msg) => {
                    errors.push(result.fileName + ': ' + msg);
                    isValid = false;
                });
                return isValid;
            });

            if (0 < errors.length) {
                this.notifyService.toast(errors);
            }
            return valid;
        }

    }

    angular.module('meshAdminUi.admin')
        .controller('SchemaListController', SchemaListController);

}