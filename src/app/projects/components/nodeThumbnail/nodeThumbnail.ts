module meshAdminUi {


    /**
     * Displays a thumbnail representation of a node. If the node has any binary fields, the first one is used
     * as the thumbnail. If it is a container, it shows a folder icon.
     */
    class NodeThumbnailController {
        public node: INode;
        public hasBinaryField: boolean;
        public binaryProperties: {
            isImage?: boolean;
            fieldName?: string,
            binaryField?: IBinaryField
        } = {};

        constructor($scope: ng.IScope,
                    private mu: MeshUtils,
                    private contextService: ContextService) {

            let unwatch = $scope.$watch(() => this.node, val => {
                if (val !== undefined) {
                    this.checkForBinaryFields(val);
                    unwatch();
                }
            })
        }

        /**
         * Check if this node has any binary fields, get the first binary field if one exists
         * and populate the various component vars.
         */
        private checkForBinaryFields(node: INode) {
            let firstBinaryField = this.mu.getFirstBinaryField(node);
            if (firstBinaryField.key !== undefined) {
                this.hasBinaryField = true;
                this.binaryProperties.isImage = this.mu.isImageField(firstBinaryField.value);
                this.binaryProperties.fieldName = firstBinaryField.key;
                this.binaryProperties.binaryField = firstBinaryField.value;

            }
        }

        public getFileUrl(): string {
            let projectName = this.contextService.getProject().name;
            let imageOptions = { width: 128 };
            return this.mu.getBinaryFileUrl(
                projectName,
                this.node.uuid,
                this.node.language,
                this.binaryProperties.fieldName,
                this.binaryProperties.binaryField.sha512sum,
                imageOptions);
        }

        public getFileName(): string {
            if (this.hasBinaryField) {
                return this.binaryProperties.binaryField.fileName;
            }
            return '';
        }

        public getFileExt(): string {
            let filename = this.getFileName();
            if (filename) {
                let parts = filename.split('.');
                return parts[parts.length - 1];
            }
            return '';
        }
    }

    function nodeThumbnailDirective() {
        return {
            restrict: 'E',
            templateUrl: 'projects/components/nodeThumbnail/nodeThumbnail.html',
            controller: 'NodeThumbnailController',
            controllerAs: 'vm',
            bindToController: true,
            scope: {
                node: '=',
            }
        }
    }

    angular.module('meshAdminUi.projects')
        .directive('nodeThumbnail', nodeThumbnailDirective)
        .controller('NodeThumbnailController', NodeThumbnailController);
}
