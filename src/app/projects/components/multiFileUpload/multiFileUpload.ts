module meshAdminUi {
    interface MultiFileUploadSettings {
        [projectName: string]: {
            selectedSchema: string;
            selectedField: string;
            publishNodes: boolean;
        }
    }
    /**
     * The MultiFileUpload service is used to show the file upload dialog.
     */
    export class MultiFileUpload {

        constructor(private $mdDialog: ng.material.IDialogService) {
        }

        public open(parentNodeUuid: string) {
            return this.$mdDialog.show({
                templateUrl: 'projects/components/multiFileUpload/multiFileUpload.html',
                controller: 'multiFileUploadController',
                controllerAs: 'vm',
                locals: {
                    parentNodeUuid
                },
                bindToController: true
            });
        }
    }

    class MultiFileUploadController {
        // Set from Dialog open
        private parentNodeUuid: string;

        private transform: IImageTransformParams = {};

        private projectName: string;

        private schemas: ISchema[];
        private selectedSchema: ISchema;

        private fields: ISchemaFieldDefinition[];
        private selectedField: ISchemaFieldDefinition;

        private isValid: boolean = true;

        private files: File[];
        private filesChosen: boolean = false;
        private totalSize: number;

        private publishNodes: boolean = false;

        private isUploading: boolean = false;
        private uploadProgress: number = 0;
        private uploadedBytes: number = 0;

        constructor(private dataService: DataService,
                    private contextService: ContextService,
                    private $mdDialog: ng.material.IDialogService,
                    private i18nService: I18nService,
                    private notifyService: NotifyService,
                    private localStorageService) {
            this.init();
        }

        private init() {
            this.projectName = this.contextService.getProject().name;
            this.dataService.getProjectSchemas(this.projectName).then(
                schemas => this.schemas = schemas.data.filter(MeshUtils.hasBinaryField)
            ).then(() => this.loadSettings());
        }

        private updateFields() {
            this.fields = this.selectedSchema.fields.filter(MeshUtils.isBinaryField);
            this.selectedField = this.fields[0];
            this.checkValidity();
        }

        /**
         * Checks if the selected schema and field is valid for multi file upload.
         * A schema is valid if it has no required fields other than the selected field.
         */
        private checkValidity(): void {
            this.isValid = this.selectedSchema.fields
                .filter(field => field.required && field.name !== this.selectedField.name)
                .length === 0;
        }

        private filesChanged() {
            this.filesChosen = this.files && this.files.length > 0;
            this.totalSize = this.files.map(it => it.size).reduce(MeshUtils.sum, 0);
        }

        private uploadEnabled(): boolean {
            return !!(
                this.filesChosen &&
                this.selectedSchema &&
                this.selectedField &&
                this.isValid &&
                !this.isUploading
            );
        }

        private upload() {
            this.isUploading = true;
            // Recursively upload files
            // We don't want to run the uploads in parallel, because its harder to cancel the upload and
            // it also does not really gain much performance
            const recursiveUpload: (number) => ng.IPromise<any> = i => {
                if (i < this.files.length) {
                    return this.uploadFile(this.files[i]).then(() => recursiveUpload(i+1))
                }
            };
            recursiveUpload(0).then(() => {
                this.notifyService.toast('UPLOAD_COMPLETE');
                this.close();
            }).catch(err => {
                this.notifyService.toast(err)
            });
        }

        private uploadFile(file: File): ng.IPromise<INode> {
            let lastLoaded = 0;
            return this.dataService.persistNode(this.projectName, {
                schema: {
                    name: this.selectedSchema.name
                },
                language: this.i18nService.getCurrentLang().code,
                parentNode: {
                    uuid: this.parentNodeUuid
                },
                fields: {}
            }).then(node => {
                return this.dataService.uploadBinaryFile(
                    this.projectName, node.uuid, this.selectedField.name,
                    file, node.version, ev => {
                        this.bytesLoaded(ev.loaded - lastLoaded);
                        lastLoaded = ev.loaded;
                    }
                )
            }).then(node => {
                if (this.publishNodes) {
                    return this.dataService.publishNode(this.projectName, node)
                        .then(resp => node);
                }
                return node;
            });
        }

        private bytesLoaded(count: number) {
            this.uploadedBytes += count;
            this.uploadProgress = 100 * this.uploadedBytes / this.totalSize;
        }

        private loadSettings() {
            const settings: MultiFileUploadSettings = this.localStorageService.get('multi-file-upload');
            if (settings && settings[this.projectName]) {
                const projectSettings = settings[this.projectName];
                this.publishNodes = !!projectSettings.publishNodes;
                if (this.schemas) {
                    this.selectedSchema = this.schemas.filter(schema => schema.uuid === projectSettings.selectedSchema)[0];
                }
                this.updateFields();
                if (this.selectedSchema) {
                    this.selectedField = this.selectedSchema.fields.filter(field => field.name === projectSettings.selectedField)[0];
                }
            }
        }

        public saveSettings() {
            let settings: MultiFileUploadSettings = this.localStorageService.get('multi-file-upload');
            if (!settings) {
                settings = {};
            }
            settings[this.projectName] = {
                selectedField: this.selectedField && this.selectedField.name,
                selectedSchema: this.selectedSchema && this.selectedSchema.uuid,
                publishNodes: this.publishNodes
            };
            this.localStorageService.set('multi-file-upload', settings);
        }

        private close() {
            this.saveSettings();
            this.$mdDialog.hide();
        }

        private cancel() {
            this.saveSettings();
            this.$mdDialog.cancel();
        }
    }

    angular.module('meshAdminUi.projects')
           .service('multiFileUpload', MultiFileUpload)
           .controller('multiFileUploadController', MultiFileUploadController)

}