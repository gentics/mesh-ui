module meshAdminUi {

    class TagListController {

        private tags: ITag[] = [];
        private projectGroups: { project: IProject, tagFamilies: ITagFamily[] }[] = [];

        constructor(private $q: ng.IQService,
                    private $mdDialog: ng.material.IDialogService,
                    private notifyService: NotifyService,
                    private dataService: DataService) {

            dataService.getProjects()
                .then(response => {
                    return $q.all(response.data.map(project => {
                        return $q.all({
                            project: project,
                            tagFamilies: dataService.getTagFamilies(project.name),
                            tags: dataService.getTags(project.name)
                        });
                    }))
                })
                .then(result => {
                    result.forEach(item => {
                        this.projectGroups.push({
                            project: item.project,
                            tagFamilies: item.tagFamilies.data
                        });
                        this.tags = this.tags.concat(item.tags.data);
                    });
                });
        }

        public addTagDialog(project: IProject, tagFamily: ITagFamily) {
            this.showDialog('Create new tag')
                .then(name => {
                    let tag = {
                        fields: { name: name },
                        tagFamily: tagFamily
                    };
                    return this.dataService.persistTag(project.name, tag)
                })
                .then(tag => {
                    this.tags.push(tag);
                    this.notifyService.toast(`Created new tag`);
                })
        }

        public editTagDialog(project: IProject, tag: ITag) {
            this.showDialog('Edit tag', tag.fields.name)
                .then(name => {
                    tag.fields.name = name;
                    return this.dataService.persistTag(project.name, tag);
                })
                .then(newTag => {
                    let index = this.tags.map(tag => tag.uuid).indexOf(newTag.uuid);
                    this.tags[index] = newTag;
                    this.notifyService.toast(`Updated tag`);
                })
        }

        public deleteTag(event: Event, project: IProject, tag: ITag) {
            event.stopPropagation();
            event.preventDefault();

            return this.dataService.deleteTag(project.name, tag)
                .then(newTag => {
                    let index = this.tags.map(tag => tag.uuid).indexOf(newTag.uuid);
                    this.tags.splice(index, 1);
                    this.notifyService.toast(`Deleted tag`);
                });
        }

        public getTagsByFamily(tagFamily: ITagFamily): ITag[] {
            return this.tags.filter(tag => tag.tagFamily.uuid === tagFamily.uuid);
        }

        private showDialog(title: string, currentName?: string) {
            return this.$mdDialog.show({
                controller: class {
                    private name: string;

                    constructor(private $mdDialog: ng.material.IDialogService,
                                private title: string,
                                private currentName: string) {
                        this.name = currentName;
                    }

                    public create(name) {
                        this.$mdDialog.hide(name);
                    }

                    public cancel() {
                        this.$mdDialog.cancel();
                    }
                },
                controllerAs: 'vm',
                templateUrl: 'admin/tags/list/tagEditDialog.html',
                locals: {
                    title: title,
                    currentName: currentName
                }
            });
        }

    }

    angular.module('meshAdminUi.admin')
        .controller('TagListController', TagListController);

}
