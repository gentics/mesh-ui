module meshAdminUi {

    interface INewTagDialogResponse {
        tagName: string;
        tagFamilyRef: ITagFamily;
        newTagFamilyName: string;
    }

    class NewTagDialogController {

        private selectedTagFamily: ITagFamily;
        private tagFamilySearch: string;

        constructor(private tagFamilies: ITagFamily[],
                    private tagName: string,
                    private $mdDialog: ng.material.IDialogService) {

        }

        public querySearch(query) {
            if (query === '') {
                return this.tagFamilies;
            } else {
                return this.tagFamilies.filter((tagFamilies: ITagFamily) => -1 < tagFamilies.name.indexOf(query));
            }
        }

        public create() {
            this.$mdDialog.hide({
                tagName: this.tagName,
                tagFamilyRef: this.selectedTagFamily,
                newTagFamilyName: this.tagFamilySearch
            });
        }

        public cancel() {
            this.$mdDialog.cancel();
        }
    }

    class TagsInputController {

        public tagFamilies: ITagFamily[];
        public tags: ITag[];
        private tagSearch: string;
        private projectName: string;
        private onAdd: Function;

        constructor(private $q: ng.IQService,
                    private $mdDialog: ng.material.IDialogService,
                    private dataService: DataService,
                    private contextService: ContextService) {

            this.projectName = contextService.getProject().name;
            this.populateTags();
        }

        /**
         * If the tags or tagFamilies have not been passed in, fetch them from the dataService.
         */
        private populateTags() {
            if (!this.tags) {
                this.dataService.getTags(this.projectName)
                    .then(result => this.tags = result.data);
            }
            if (!this.tagFamilies) {
                this.dataService.getTagFamilies(this.projectName)
                    .then(result => this.tagFamilies = result.data);
            }
        }

        public querySearch (query: string) {
            if (query === '') {
                return this.tags;
            } else {
                const filterName = (tag: ITag) => -1 < tag.fields.name.toLowerCase().indexOf(query.toLowerCase());
                return this.tags.filter(filterName);
            }
        }

        public newTagDialog(name) {
            this.$mdDialog.show({
                    controller: 'NewTagDialogController',
                    controllerAs: 'vm',
                    bindToController: true,
                    templateUrl: 'projects/components/tagsInput/newTagDialog.html',
                    locals: {
                        tagFamilies: this.tagFamilies,
                        tagName: name
                    }
                })
                .then((response: INewTagDialogResponse) => {
                    let getTagFamily: ng.IPromise<ITagFamily>;

                    if (!response.tagFamilyRef && response.newTagFamilyName) {
                        let tagFamily = this.createEmptyTagFamily(response.newTagFamilyName);
                        getTagFamily = this.dataService.persistTagFamily(this.projectName, tagFamily)
                            .then(tagFamily => {
                                this.tagFamilies.push(tagFamily);
                                return tagFamily;
                            });
                    } else {
                        getTagFamily = this.$q.when(response.tagFamilyRef);
                    }

                    getTagFamily.then(tagFamily => {
                        let tag = this.createEmptyTag(response.tagName, tagFamily);
                        return this.dataService.persistTag(this.projectName, tag);
                    })
                    .then(tag => {
                        this.tags.push(tag);
                        this.addTag(tag);
                        this.tagSearch = '';
                    });

                });
        }

        public addTag(tag: ITag) {
            this.onAdd({ tag: tag });
            this.tagSearch = '';
        }

        private createEmptyTagFamily(name: string): ITagFamily {
            return {
                name: name
            };
        }

        private createEmptyTag(name, tagFamily: ITagFamily): ITag {
            return {
                tagFamily: {
                    name: tagFamily.name,
                    uuid: tagFamily.uuid
                },
                fields: {
                    name: name
                }
            };
        }

    }

    /**
     * The search/nav bar component which allows and contextual search of projects.
     */
    function tagsInputDirective() {

        return {
            restrict: 'E',
            templateUrl: 'projects/components/tagsInput/tagsInput.html',
            controller: 'TagsInputController',
            controllerAs: 'vm',
            bindToController: true,
            scope: {
                onAdd: '&',
                tags: '=',
                tagFamilies: '='
            }
        };
    }

    angular.module('meshAdminUi.projects')
        .directive('tagsInput', tagsInputDirective)
        .controller('NewTagDialogController', NewTagDialogController)
        .controller('TagsInputController', TagsInputController);
}