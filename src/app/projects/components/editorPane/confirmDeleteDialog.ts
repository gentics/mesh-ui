module meshAdminUi {

    class ConfirmDeleteDialogController {

        public langsToDelete: any = {};

        constructor(private node: INode,
                    private $mdDialog: ng.material.IDialogService,
                    private i18nService: I18nService) {
            this.langsToDelete[node.language] = true;
        }

        public getLangInfo(code: string): ILanguageInfo {
            return this.i18nService.getLanguageInfo(code);
        }

        public deleteNode() {
            let selectedLangs = Object.keys(this.langsToDelete).filter(code => {
                return this.langsToDelete[code] === true;
            });
            this.$mdDialog.hide(selectedLangs);
        }

        public cancel() {
            this.$mdDialog.cancel();
        }

    }


    angular.module('meshAdminUi.projects')
        .controller('ConfirmDeleteDialogController', ConfirmDeleteDialogController);
}
