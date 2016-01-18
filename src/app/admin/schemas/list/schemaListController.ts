module meshAdminUi {

    interface IImportResult {
        fileName: string;
        content: string;
    }

    class SchemaListController {

        public schemas: ISchema[];
        public schemaFilter: string;

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