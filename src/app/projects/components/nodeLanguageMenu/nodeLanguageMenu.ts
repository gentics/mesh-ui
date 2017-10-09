module meshAdminUi {

    class NodeLanguageMenuController {

        public node: INode;
        private omitCurrentLanguage: any = false;
        private showTranslateButton: any = true;
        public unusedLangs: ILanguageInfo[] = [];
        private onTranslateClick: Function;
        private onChangeLanguage: Function;

        constructor(private $scope: ng.IScope,
                    private i18nService: I18nService) {

            $scope.$watch(() => this.node && this.node.uuid, val => {
                if (val) {
                    this.unusedLangs = this.getUnusedLangs();
                }
            });
        }

        private getUnusedLangs(): ILanguageInfo[] {
            let available = this.i18nService.getAvailableLanguages();
            if (!this.node.availableLanguages) {
                return [];
            }
            return available.filter(lang => {
                return !this.node.availableLanguages[lang.code];
            });
        }

        public getAvailableLanguages(node: INode): ILanguageInfo[] {
            let langCodes: string[];
            if (!node || !node.availableLanguages) {
                return [];
            }
            if (this.omitCurrentLanguage !== false && this.omitCurrentLanguage !== 'false') {
                langCodes = Object.keys(node.availableLanguages).filter(lang => lang !== node.language);
            } else {
                langCodes = Object.keys(node.availableLanguages);
            }
            return langCodes.map(code => this.i18nService.getLanguageInfo(code));
        }

        public translateClick(code: string) {
            this.onTranslateClick({ code: code });
        }

        public goToTranslation(code: string) {
            this.onChangeLanguage({ code: code });
        }
    }

    function nodeLanguageMenuDirective() {
        return {
            restrict: 'E',
            templateUrl: 'projects/components/nodeLanguageMenu/nodeLanguageMenu.html',
            controller: 'NodeLanguageMenuController',
            controllerAs: 'vm',
            bindToController: true,
            scope: {
                node: '=',
                omitCurrentLanguage: '@',
                showTranslateButton: '@',
                onTranslateClick: '&',
                onChangeLanguage: '&'
            }
        }
    }

    angular.module('meshAdminUi.projects')
        .directive('nodeLanguageMenu', nodeLanguageMenuDirective)
        .controller('NodeLanguageMenuController', NodeLanguageMenuController);
}
