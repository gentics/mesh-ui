module meshAdminUi {

    class ConfirmUnpublishDialogController {

        public langsToUnpublish: any = {};
        public currentLangInfo: ILanguageInfo;
        public unpublishAllLangs: boolean = false;

        constructor(private $mdDialog: ng.material.IDialogService,
                    private i18nService: I18nService,
                    private node: INode) {
            if (node) {
                this.langsToUnpublish[node.language] = true;
            }
            this.currentLangInfo = i18nService.getCurrentLang();
        }

        public getLangInfo(code: string): ILanguageInfo {
            return this.i18nService.getLanguageInfo(code);
        }

        public unpublishNode() {
            let selectedLangs = Object.keys(this.langsToUnpublish).filter(code => {
                return this.langsToUnpublish[code] === true;
            });
            this.$mdDialog.hide(selectedLangs);
        }

        public unpublishNodeMulti() {
            this.$mdDialog.hide({
                unpublishAllLangs: this.unpublishAllLangs
            });
        }

        public getAvailableLanguages(): string[] {
            return Object.keys(this.node.availableLanguages);
        }

        public cancel() {
            this.$mdDialog.cancel();
        }

    }


    angular.module('meshAdminUi.projects')
        .controller('ConfirmUnpublishDialogController', ConfirmUnpublishDialogController);
}
