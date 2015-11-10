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
            console.log('tag families', this.tagFamilies);
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

        public tagFamilies: ITagFamily[] = [];
        public tags: ITag[] = [];
        private tagSearch: string;
        private projectName: string;
        private onAdd: Function;

        constructor(private $q: ng.IQService,
                    private $mdDialog: ng.material.IDialogService,
                    private dataService: DataService,
                    private contextService: ContextService) {

            this.projectName = contextService.getProject().name;

            $q.all({
                    tags: dataService.getTags(this.projectName),
                    tagFamilies: dataService.getTagFamilies(this.projectName)
                })
                .then((result) => {
                    this.tags = result.tags.data;
                    this.tagFamilies = result.tagFamilies.data;
                });
        }

        public querySearch (query) {
            if (query === '') {
                return this.tags;
            } else {
                return this.tags.filter((tag: ITag) => -1 < tag.fields.name.indexOf(query));
            }
        }

        public newTagDialog(name) {
            console.log('creating tag', name);

            this.$mdDialog.show({
                    controller: NewTagDialogController,
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
            controller: 'tagsInputController',
            controllerAs: 'vm',
            bindToController: true,
            scope: {
                onAdd: '&'
            }
        };
    }

    angular.module('meshAdminUi.projects')
        .directive('tagsInput', tagsInputDirective)
        .controller('tagsInputController', TagsInputController);
}