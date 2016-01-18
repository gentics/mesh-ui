module meshAdminUi {

    declare var meshConfig: any;

    class PreviewSelectorController {

        private previewUrl: string;
        private previewUrls: any[] = [];
        private linkRenderingMode: string = 'full';
        private linkRenderingModes: string[] = ['off', 'full', 'medium', 'short'];
        private node: INode;

        constructor(private dataService: DataService) {

            if (this.canPreview()) {
                this.previewUrls = meshConfig.previewUrls.map(obj => {
                    let label = Object.keys(obj)[0];
                    let url = obj[label];
                    return {label, url};
                });
                this.previewUrl = this.previewUrls[0].url;
            }
        }

        /**
         * Returns true if a previewUrl has been provided in the meshConfig file.
         */
        public canPreview(): boolean {
            let url = meshConfig.previewUrls;
            return !!(url && url !== '');
        }

        public getPreviewUrls(): any[] {
            return this.previewUrls;
        }

        /**
         * If a previewUrl has been set in the meshConfig.js file, this method can be used to open that URL
         * and POST the current node data to it, for the purpose of rendering a preview.
         */
        public preview(previewUrl: string, linkRenderMode: string, node: INode) {

            let stringFields = JSON.stringify(node.fields);
            this.dataService.renderLinksInText(stringFields, linkRenderMode)
                .then(result => {
                    let nodeClone = angular.copy(node);
                    nodeClone.fields = result;
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
