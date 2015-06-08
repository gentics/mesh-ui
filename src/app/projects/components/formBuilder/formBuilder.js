angular.module('meshAdminUi.projects.formBuilder')
    .directive('formBuilder', formBuilderDirective);

/**
 * Component for auto-generating a form from schema data.
 *
 * API:
 * ====
 * model = the object properties from the database, e.g. "content.properties", "tag.properties" etc.
 * fields = the schema properties array
 * modified-flag = boolean value that will be set to true when user modifies any form fields.
 *
 * @returns {ng.IDirective} Directive definition object
 */
function formBuilderDirective() {

    function formBuilderController() {
        var vm = this;

        vm.canUpdate = canUpdate;

        /**
         * Does the current user have permission to update this content? If not,
         * form fields are disabled.
         * @returns {boolean}
         */
        function canUpdate() {
            return -1 < vm.perms.indexOf('update');
        }
    }

    return {
        restrict: 'E',
        replace: true,
        templateUrl: 'projects/components/formBuilder/formBuilder.html',
        controller: formBuilderController,
        controllerAs: 'vm',
        bindToController: true,
        scope: {
            model: '=',
            fields: '=',
            modified: '=modifiedFlag',
            perms: '='
        }
    };
}