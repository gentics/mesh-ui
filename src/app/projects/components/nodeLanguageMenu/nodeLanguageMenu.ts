module meshAdminUi {

    class NodeLanguageMenuController {

        public node: INode;
        public unusedLangs: string[] = [];
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

        private getUnusedLangs() {
            let available = this.i18nService.getAvailableLanguages().map(lang => lang.code);
            if (!this.node.availableLanguages) {
                return [];
            }
            return available.filter(code => {
                return this.node.availableLanguages.indexOf(code) == -1;
            });
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
                onTranslateClick: '&',
                onChangeLanguage: '&'
            }
        }
    }

    angular.module('meshAdminUi.projects')
        .directive('nodeLanguageMenu', nodeLanguageMenuDirective)
        .controller('NodeLanguageMenuController', NodeLanguageMenuController);
}
