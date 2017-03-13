module meshAdminUi {

    class PermissionsTableController {

        public collapsed: boolean = true;
        public filter: string = '';
        private items: IMeshBaseProps[];
        private itemPermissions: { [itemUuid: string]: IPermissions } = {};
        private rootPermissions: any;
        private itemNameField: string;
        private onToggle: Function;

        constructor(private $scope: ng.IScope,
                    private mu: MeshUtils) {
            /**
             * The `item` array will be populated async when the data arrives from the server call, so we
             * need to watch it and once it is populated, process the array and cancel the watcher.
             */
            var cancelItemsWatcher = $scope.$watch(() => this.items, newVal => {
                if (newVal) {
                    this.items = newVal;
                    this.items.forEach(item => {
                        this.itemPermissions[item.uuid] = item.rolePerms;
                    });
                    cancelItemsWatcher();
                }
            });

            this.rootPermissions = this.rootPermissions || {};
        }

        /**
         * Evaluate the expression provided in the `itemNameField` field against the provided
         * `item` object and return the result.
         */
        public displayItemName(item) {
            return this.$scope.$eval(this.itemNameField, {item: item});
        }

        /**
         * Filter by item name.
         */
        public itemNameFilter = (item) => {
            var name;

            if (this.filter !== '') {
                name = this.displayItemName(item);
                return name.toLowerCase().indexOf(this.filter.toLowerCase()) > -1;
            } else {
                return true;
            }
        };

        public toggle(item) {
            let permObject = this.itemPermissions[item.uuid],
                permissions: IPermissionsRequest = {
                    permissions: permObject,
                    recursive: false
                };
            this.onToggle({ permissions: permissions, item: item });
        }

        public toggleRootPerm() {
            let permissions: IPermissionsRequest = {
                permissions: this.rootPermissions,
                recursive: false
            };
            this.onToggle({ permissions: permissions });
        }
    }

    function permissionsTableDirective() {

        return {
            restrict: 'E',
            templateUrl: 'admin/components/permissionsTable/permissionsTable.html',
            controller: 'PermissionsTableController',
            controllerAs: 'vm',
            bindToController: true,
            scope: {
                isReadonly: '=',
                rootName: '@',
                rootPermissions: '=',
                items: '=',
                itemNameField: '@',
                onToggle: '&'
            }
        };
    }

    angular.module('meshAdminUi.admin')
        .directive('permissionsTable', permissionsTableDirective)
        .controller('PermissionsTableController', PermissionsTableController);

}