module meshAdminUi {

    declare var meshUiConfig: any;

    class PreviewSelectorController {

        private previewUrl: string;
        private previewUrls: any[] = [];
        private linkRenderingMode: string = 'full';
        private linkRenderingModes: string[] = ['off', 'full', 'medium', 'short'];
        private node: INode;

        constructor(private $q: ng.IQService,
                    private dataService: DataService,
                    private contextService: ContextService) {

            if (this.canPreview()) {
                let projectName = contextService.getProject().name;

                for (let name in meshUiConfig.previewUrls) {
                    if (name === 'default' || name === projectName) {
                        let urls = meshUiConfig.previewUrls[name].map(obj => {
                            let label = Object.keys(obj)[0];
                            let url = obj[label];
                            return {label, url};
                        });
                        this.previewUrls = this.previewUrls.concat(urls);
                    }
                }
                this.previewUrl = this.previewUrls[0].url;
            }
        }

        /**
         * Returns true if a previewUrl has been provided in the mesh-ui-config.js file.
         */
        public canPreview(): boolean {
            let url = meshUiConfig.previewUrls;
            return !!(url && url !== '');
        }

        public getPreviewUrls(): any[] {
            return this.previewUrls;
        }

        /**
         * If a previewUrl has been set in the mesh-ui-config.js file, this method can be used to open that URL
         * and POST the current node data to it, for the purpose of rendering a preview.
         */
        public preview(previewUrl: string, linkRenderMode: string, node: INode) {

            let stringFields = JSON.stringify(node.fields);
            let projectName = this.contextService.getProject().name;

            // We need to get the node with the `resolveLinks` param in order to
            // get the `languagePaths` property, which may be needed for the preview.
            let nodeResponse = this.dataService.getNode(projectName, node.uuid, { resolveLinks: linkRenderMode });
            let fieldsResponse = this.dataService.renderLinksInText(stringFields, linkRenderMode);

            this.$q.all([nodeResponse, fieldsResponse])
                .then(result => {
                    let nodeClone = <INode>result[0];
                    nodeClone.fields = result[1];
                    this.postNodeToUrl(nodeClone, previewUrl);
                })
        }

        /**
         * POST a serialized version of the node to the given URL, causing it to open in a new window.
         */
        private postNodeToUrl(node: INode, url: string) {
            let form = <HTMLFormElement>document.createElement("form");
            form.action = url;
            form.method = 'POST';
            form.target = '_blank';

            let input = document.createElement("textarea");
            input.name = 'node';
            input.value = JSON.stringify(node);
            form.appendChild(input);
            form.style.display = 'none';
            document.body.appendChild(form);
            form.submit();
            form.remove();
        }
    }

    function previewSelectorDirective() {
        return {
            restrict: 'E',
            templateUrl: 'projects/components/previewSelector/previewSelector.html',
            controller: 'PreviewSelectorController',
            controllerAs: 'vm',
            bindToController: true,
            scope: {
                node: '='
            }
        }
    }

    angular.module('meshAdminUi.projects')
        .directive('previewSelector', previewSelectorDirective)
        .controller('PreviewSelectorController', PreviewSelectorController);
}
