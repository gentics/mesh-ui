module meshAdminUi {

    class ExpandableTagsListController {

        public tagsLimit: number = 3;
        public isExpanded: boolean = false;

        constructor() {
        }

        public toggle(event: Event) {
            event.stopPropagation();
            event.preventDefault();
            this.isExpanded = !this.isExpanded;
            this.tagsLimit = this.isExpanded ? 1000 : 3;
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
