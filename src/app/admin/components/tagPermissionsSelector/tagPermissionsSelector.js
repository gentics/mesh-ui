angular.module('meshAdminUi.admin')
    .directive('tagPermissionsSelector', tagPermissionsSelectorDirective);

/**
 *
 * @param {ng.IQService} $q
 * @param {DataService} dataService
 * @param {meshUtils} mu
 * @returns {{}}
 */
function tagPermissionsSelectorDirective($q, dataService, mu) {

    function tagPermissionsSelectorController() {
        var vm = this,
            queryParams = {
                "role": vm.roleId
            };

        vm.filterTags = filterTags;
        vm.toggleExpand = toggleExpand;
        vm.filter = '';
        vm.items = [];

        populateItems();

        /**
         * Filter function for matching node names.
         * @param {Object} item
         * @returns {boolean}
         */
        function filterTags(item) {
            var name;

            if (vm.filter !== '') {
                if (item.name) {
                    name = item.name;
                } else {
                    name = item.fields.name;
                }
                return name.toLowerCase().indexOf(vm.filter.toLowerCase()) > -1;
            } else {
                return true;
            }
        }

        /**
         * Toggle whether the tags in a tag family should be expanded.
         * @param {Object} tagFamily
         */
        function toggleExpand(tagFamily) {
            if (tagFamily.description) {
                if (vm.expand === tagFamily.uuid) {
                    vm.expand = '';
                } else {
                    vm.expand = tagFamily.uuid;
                }
            }
        }

        /**
         * Populate the vm.items array by recursing through all projects/tagFamilies/tags and flattening the
         * results into an array.
         *
         */
        function populateItems() {
            return dataService.getProjects(queryParams)
                .then(function(projects) {
                    var promises = [];
                    projects.forEach(function(project) {
                        promises.push(project);
                        promises = promises.concat(populateTagFamilies(project));
                    });
                    return $q.all(promises);
                })
                .then(mu.flatten)
                .then(function(items) {
                    vm.items = items.map(mu.rolePermissionsArrayToKeys);
                });
        }

        /**
         * Return an array of tagFamilies for the project with the tags of each tagFamily following the
         * tagFamily in the array.
         *
         * @param {Object} project
         * @returns {IPromise<TResult>}
         */
        function populateTagFamilies(project) {
            return dataService.getTagFamilies(project.name, queryParams)
                .then(function(tagFamilies) {
                    var promises = [];
                    project.tagFamilies = tagFamilies;
                    project.tagFamilies.forEach(function(tagFamily) {
                        promises.push($q.when(tagFamily));
                        promises = promises.concat(dataService.getTags(project.name, tagFamily.uuid, queryParams));
                    });
                    return $q.all(promises);
                });
        }
    }

    return {
        restrict: 'E',
        templateUrl: 'admin/components/tagPermissionsSelector/tagPermissionsSelector.html',
        controller: tagPermissionsSelectorController,
        controllerAs: 'vm',
        bindToController: true,
        scope: {
            roleId: '='
        }
    };
}