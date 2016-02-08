module meshAdminUi {

    import ITranscludeFunction = ng.ITranscludeFunction;

    class TagListController {

        private tags: ITag[] = [];
        private projectGroups: { project: IProject, tagFamilies: ITagFamily[] }[] = [];

        constructor(private $q: ng.IQService,
                    private $mdDialog: ng.material.IDialogService,
                    private confirmActionDialog: ConfirmActionDialog,
                    private notifyService: NotifyService,
                    private dataService: DataService) {

            dataService.getProjects()
                .then(response => {
                    return $q.all(response.data.map(project => {
                        return $q.all({
                            project: $q.when(project),
                            tagFamilies: dataService.getTagFamilies(project.name),
                            tags: dataService.getProjectTags(project.name)
                        });
                    }))
                })
                .then(result => {
                    result.forEach((item: any) => {
                        this.projectGroups.push({
                            project: item.project,
                            tagFamilies: item.tagFamilies.data
                        });
                        const flatten = arr => arr.reduce((arr, t) => arr.concat(t), []);
                        this.tags = this.tags.concat(flatten(item.tags));
                    });
                });
        }

        public addTagFamilyDialog(project: IProject) {
            this.showDialog('CREATE_NEW_TAG_FAMILY')
                .then(name => {
                    let tagFamily = { name: name };
                    return this.dataService.persistTagFamily(project.name, tagFamily)
                })
                .then(tagFamily => {
                    let index = this.projectGroups.map(group => group.project.uuid).indexOf(project.uuid);
                    this.projectGroups[index].tagFamilies.push(tagFamily);
                    this.notifyService.toast('TAG_FAMILY_CREATED');
                })
        }

        public editTagFamilyDialog(project: IProject, tagFamily: ITagFamily) {
            this.showDialog('EDIT_TAG_FAMILY', tagFamily.name)
                .then(name => {
                    tagFamily.name = name;
                    return this.dataService.persistTagFamily(project.name, tagFamily);
                })
                .then(tagFamily => {
                    let projectGroup = this.getProjectGroupIndex(project),
                        index = projectGroup.tagFamilies.map(tf => tf.uuid).indexOf(tagFamily.uuid);
                    projectGroup.tagFamilies[index] = tagFamily;
                    this.notifyService.toast('TAG_FAMILY_UPDATED');
                })

        }

        public deleteTagFamilyDialog(event: Event, project: IProject, tagFamily: ITagFamily) {
            event.stopPropagation();
            event.preventDefault();

            this.confirmActionDialog.show({
                    title: 'DELETE_TAG_FAMILY',
                    message: 'DELETE_TAG_FAMILY_AND_ALL_TAGS'
                })
                .then(() => {
                    return this.dataService.deleteTagFamily(project.name, tagFamily);
                })
                .then(() => {
                    let projectGroup = this.getProjectGroupIndex(project),
                        index = projectGroup.tagFamilies.map(tf => tf.uuid).indexOf(tagFamily.uuid);
                    projectGroup.tagFamilies.splice(index, 1);
                    this.notifyService.toast(`TAG_FAMILY_DELETED`);
                });
        }

        /**
         * Get the projectgroup object at corresponding to the given project.
         */
        private getProjectGroupIndex(project: IProject): any {
            let index = this.projectGroups.map(group => group.project.uuid).indexOf(project.uuid);
            return this.projectGroups[index]
        }

        public addTagDialog(project: IProject, tagFamily: ITagFamily) {
            this.showDialog('ADD_TAG')
                .then(name => {
                    let tag: ITag = {
                        fields: { name: name },
                        tagFamily: tagFamily
                    };
                    return this.dataService.persistTag(project.name, tag)
                })
                .then(tag => {
                    this.tags.push(tag);
                    this.notifyService.toast('NEW_TAG_CREATED');
                })
        }

        public editTagDialog(project: IProject, tag: ITag) {
            this.showDialog('EDIT_TAG', tag.fields.name)
                .then(name => {
                    tag.fields.name = name;
                    return this.dataService.persistTag(project.name, tag);
                })
                .then(newTag => {
                    let index = this.tags.map(tag => tag.uuid).indexOf(newTag.uuid);
                    this.tags[index] = newTag;
                    this.notifyService.toast(`UPDATED_TAG`);
                })
        }

        public deleteTag(event: Event, project: IProject, tag: ITag) {
            event.stopPropagation();
            event.preventDefault();

            return this.dataService.deleteTag(project.name, tag)
                .then(newTag => {
                    let index = this.tags.map(tag => tag.uuid).indexOf(newTag.uuid);
                    this.tags.splice(index, 1);
                    this.notifyService.toast(`DELETED_TAG`);
                });
        }

        public getTagsByFamily(tagFamily: ITagFamily): ITag[] {
            return this.tags.filter(tag => tag.tagFamily.uuid === tagFamily.uuid);
        }

        private showDialog(title: string, currentName?: string) {
            return this.$mdDialog.show({
                controller: 'TagListDialogController',
                controllerAs: 'vm',
                templateUrl: 'admin/tags/list/tagEditDialog.html',
                locals: {
                    title: title,
                    currentName: currentName
                }
            });
        }
    }

    class TagListDialogController {
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
    }

    angular.module('meshAdminUi.admin')
        .controller('TagListDialogController', TagListDialogController)
        .controller('TagListController', TagListController);

}
