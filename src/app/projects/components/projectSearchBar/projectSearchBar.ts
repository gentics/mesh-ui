module meshAdminUi {

    class ProjectSearchBarController {

        public currentProject: IProject;
        public currentNode: INode;
        public availableTags: ITag[];
        public selectedTags: ITag[] = [];
        public searchTerm: string;
        public searchAll: boolean = false;
        private debouncedPublish: Function;

        constructor($scope: ng.IScope,
                    private i18n: I18nFilter,
                    private mu: MeshUtils,
                    private contextService: ContextService,
                    private searchService: SearchService,
                    private dispatcher: Dispatcher) {

            this.availableTags = this.availableTags || [];

            this.updateCurrentContext(contextService.getProject(), contextService.getCurrentNode());
            this.debouncedPublish = mu.debounce(() => this.publishSearchParameters(), 250);

            const changeHandler = (event, project: IProject, node: INode) => {
                this.searchAll = false;
                this.searchTerm = '';
                this.updateCurrentContext(project, node);
            };
            dispatcher.subscribe(dispatcher.events.contextChanged, changeHandler);
            $scope.$on('$destroy', () => dispatcher.unsubscribeAll(changeHandler));
            $scope.$watch(() => this.searchAll, () => this.publishSearchParameters());
        }

        public getPlaceholderText() {
            let text = this.i18n('SEARCH_IN') + ' ';
            if (this.searchAll) {
                text += this.i18n('WHOLE_PROJECT');
            } else {
                text += this.currentNode.fields[this.currentNode.displayField] || this.currentProject.name;
            }
            return text + ', # to filter by tag';
        }

        /**
         * Update the view model with the current context
         */
        private updateCurrentContext(currentProject: IProject, currentNode: INode) {
            this.currentProject = currentProject;
            this.currentNode = currentNode;
        }

        public searchTextChanged(term) {
            if (!/^#/.test(term)) {
                this.debouncedPublish();
            }
        }

        public addTagFilter(tag: ITag) {
            if (!tag || !tag.uuid) {
                return;
            }
            if (this.selectedTags.indexOf(tag) === -1) {
                this.selectedTags.push(tag);
                this.searchTerm = '';
                this.publishSearchParameters();
            }
        }

        public removeTagFilter(tag: ITag) {
            let index = this.selectedTags.indexOf(tag);
            this.selectedTags.splice(index, 1);
            this.publishSearchParameters();
        }

        private publishSearchParameters() {
            let params: INodeSearchParams = {
                searchTerm: this.searchTerm,
                tagFilters: this.selectedTags,
                searchAll: this.searchAll
            };
            this.searchService.setParams(params);
            this.dispatcher.publish(this.dispatcher.events.explorerSearchParamsChanged, params);
        }

        public getTagMatches(query) {
            if (/^#/.test(query)) {
                let tagQuery = query.match(/^#(\S*)/)[1];
                if (tagQuery === '') {
                    return this.availableTags;
                } else {
                    const filterName = (tag: ITag) => -1 < tag.fields.name.toLowerCase().indexOf(tagQuery);
                    return this.availableTags.filter(filterName);
                }
            }
        }
    }

    /**
     * The search/nav bar component which allows and contextual search of projects.
     */
    function projectSearchBarDirective() {

        return {
            restrict: 'E',
            templateUrl: 'projects/components/projectSearchBar/projectSearchBar.html',
            controller: 'projectSearchBarController',
            controllerAs: 'vm',
            bindToController: true,
            scope: {
                availableTags: '='
            }
        };
    }

    angular.module('meshAdminUi.projects')
        .directive('projectSearchBar', projectSearchBarDirective)
        .controller('projectSearchBarController', ProjectSearchBarController);
}