module meshAdminUi {

    class ConfirmDeleteDialogController {

        public langsToDelete: any = {};
        public currentLangInfo: ILanguageInfo;
        public deleteAllLangs: boolean = false;

        constructor(private $mdDialog: ng.material.IDialogService,
                    private i18nService: I18nService,
                    private node: INode) {
            if (node) {
                this.langsToDelete[node.language] = true;
            }
            this.currentLangInfo = i18nService.getCurrentLang();
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

        public deleteNodeMulti() {
            this.$mdDialog.hide({
                deleteAllLangs: this.deleteAllLangs
            });
        }

        public cancel() {
            this.$mdDialog.cancel();
        }

    }


    angular.module('meshAdminUi.projects')
        .controller('ConfirmDeleteDialogController', ConfirmDeleteDialogController);
}
