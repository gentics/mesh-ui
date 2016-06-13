module meshAdminUi {

    declare var meshUiConfig: any;

    const tagDisplayLimit = meshUiConfig.tagDisplayLimit || 3;

    class ExpandableTagsListController {

        public tagsLimit: number = tagDisplayLimit;
        public isExpanded: boolean = false;

        constructor() {
        }

        public toggle(event: Event) {
            event.stopPropagation();
            event.preventDefault();
            this.isExpanded = !this.isExpanded;
            this.tagsLimit = this.isExpanded ? 99999999 : tagDisplayLimit;
        }

    }

    function expandableTagsListDirective() {
        return {
            restrict: 'E',
            templateUrl: 'projects/components/expandableTagsList/expandableTagsList.html',
            controller: 'ExpandableTagsListController',
            controllerAs: 'vm',
            bindToController: true,
            scope: {
                tags: '='
            }
        }
    }

    angular.module('meshAdminUi.projects')
        .directive('expandableTagsList', expandableTagsListDirective)
        .controller('ExpandableTagsListController', ExpandableTagsListController);
}
