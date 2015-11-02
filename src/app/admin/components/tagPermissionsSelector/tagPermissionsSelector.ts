module meshAdminUi {

    class TagPermissionsSelectorController {

        private queryParams;
        private collapsed: boolean = true;
        private filter: string = '';
        private items = [];
        private roleId: string;
        private expand: string;

        constructor(private $q: ng.IQService,
                    private dataService: DataService,
                    private mu: MeshUtils) {

            this.queryParams = { "role": this.roleId };
            this.populateItems();
        }

        /**
         * Filter function for matching node names.
         */
        public filterTags = (item): boolean => {
            var name;

            if (this.filter !== '') {
                if (item.name) {
                    name = item.name;
                } else {
                    name = item.fields.name;
                }
                return name.toLowerCase().indexOf(this.filter.toLowerCase()) > -1;
            } else {
                return true;
            }
        }

        /**
         * Toggle whether the tags in a tag family should be expanded.
         */
        public toggleExpand(tagFamily) {
            if (tagFamily.description) {
                if (this.expand === tagFamily.uuid) {
                    this.expand = '';
                } else {
                    this.expand = tagFamily.uuid;
                }
            }
        }

        /**
         * Populate the this.items array by recursing through all projects/tagFamilies/tags and flattening the
         * results into an array.
         *
         */
        private populateItems() {
            return this.dataService.getProjects(this.queryParams)
                .then(response => {
                    var promises = [];
                    response.data.forEach(project => {
                        promises.push(project);
                        promises = promises.concat(this.populateTagFamilies(project));
                    });
                    return this.$q.all(promises);
                })
                .then(result => this.mu.flatten(result))
                .then(items => {
                    this.items = items.map(item => this.mu.rolePermissionsArrayToKeys(item));
                });
        }

        /**
         * Return an array of tagFamilies for the project with the tags of each tagFamily following the
         * tagFamily in the array.
         */
        private populateTagFamilies(project: any): ng.IPromise<any> {
            return this.dataService.getTagFamilies(project.name, this.queryParams)
                .then(response => {
                    var promises = [];
                    project.tagFamilies = response.data;
                    project.tagFamilies.forEach(tagFamily => {
                        promises.push(this.$q.when(tagFamily));
                        promises = promises.concat(this.dataService.getTags(project.name, tagFamily.uuid, this.queryParams));
                    });
                    return this.$q.all(promises);
                });
        }
    }

    function tagPermissionsSelectorDirective() {

        return {
            restrict: 'E',
            templateUrl: 'admin/components/tagPermissionsSelector/tagPermissionsSelector.html',
            controller: 'TagPermissionsSelectorController',
            controllerAs: 'vm',
            bindToController: true,
            scope: {
                roleId: '='
            }
        };
    }

    angular.module('meshAdminUi.admin')
        .directive('tagPermissionsSelector', tagPermissionsSelectorDirective)
        .controller('TagPermissionsSelectorController', TagPermissionsSelectorController);

}