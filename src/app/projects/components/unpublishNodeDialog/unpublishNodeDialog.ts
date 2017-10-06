module meshAdminUi {

    export class UnpublishNodeDialog {

        constructor(private $mdDialog: ng.material.IDialogService) {
        }

        public show(node: INode): ng.IPromise<string[]> {
            return this.$mdDialog.show({
                controller: 'ConfirmUnpublishDialogController',
                controllerAs: 'vm',
                bindToController: true,
                templateUrl: 'projects/components/unpublishNodeDialog/confirmUnpublishDialog.html',
                locals: {
                    node: node
                }
            });
        }

        public showMulti(): ng.IPromise<{ unpublishAllLangs: boolean }> {
            return this.$mdDialog.show({
                controller: 'ConfirmUnpublishDialogController',
                controllerAs: 'vm',
                bindToController: true,
                templateUrl: 'projects/components/unpublishNodeDialog/confirmUnpublishDialogMulti.html',
                locals: {
                    node: false
                }
            });
        }

    }

    angular.module('meshAdminUi.projects')
        .service('unpublishNodeDialog', UnpublishNodeDialog);
}
