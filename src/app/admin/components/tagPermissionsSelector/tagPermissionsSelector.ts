module meshAdminUi {

    class TagPermissionsSelectorController {

        private queryParams;
        private collapsed: boolean = true;
        private filter: string = '';
        private items;
        private itemPermissions: {
            [itemUuid: string]: any
        } = {};
        private rootPermissions: any = {};
        private roleId: string;
        private expand: string;
        private onToggle: Function;

        constructor(private $timeout: ng.ITimeoutService) {
            this.queryParams = { "role": this.roleId };
            this.items = this.items || [];
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
        };

        /**
         * Toggle whether the tags in a tag family should be expanded.
         */
        public toggleExpand(tagFamily) {
            if (tagFamily.name && !tagFamily.rootNodeUuid) {
                if (this.expand === tagFamily.uuid) {
                    this.expand = '';
                } else {
                    this.expand = tagFamily.uuid;
                }
            }
        }

        public toggle(item, recursive: boolean = false, isProjectRoot = false) {
            this.$timeout(() => {
                let permObject = isProjectRoot ? this.rootPermissions[item.uuid] : this.itemPermissions[item.uuid],
                    permsArray = Object.keys(permObject).filter(key => permObject[key] === true),
                    permissions:IPermissionsRequest = {
                        permissions: permsArray,
                        recursive: recursive
                    };
                if (!isProjectRoot) {
                    let project = this.getItemProject(item);
                    this.onToggle({permissions: permissions, item: item, project: project});
                } else {
                    this.onToggle({permissions: permissions, project: item});
                }
            });
        }

        /**
         * Given a tag or tag family in the this.items array, return the project that it belongs to
         * (which is equivalent to the closest preceding project in the array).
         */
        private getItemProject(item: any): IProject {
            let itemIndex = this.items.map(item => item.uuid).indexOf(item.uuid);
            let projectsIndexes =this.items.reduce((acc, curr, index) => {
                if (curr.rootNodeUuid) {
                    acc.push(index);
                }
                return acc;
            }, []);
            let projectIndex = projectsIndexes.filter(index => index < itemIndex).reverse()[0];
            return this.items[projectIndex];
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
                items: '=',
                itemPermissions: '=',
                rootPermissions: '=',
                roleId: '=',
                isReadonly: '=',
                onToggle: '&'
            }
        };
    }

    angular.module('meshAdminUi.admin')
        .directive('tagPermissionsSelector', tagPermissionsSelectorDirective)
        .controller('TagPermissionsSelectorController', TagPermissionsSelectorController);

}