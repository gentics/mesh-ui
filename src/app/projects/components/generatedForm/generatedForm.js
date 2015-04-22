angular.module('caiLunAdminUi.projects')
    .directive('generatedForm', generatedFormDirective);

/**
 * Component for auto-generating a form from schema data.
 *
 * API:
 * ====
 * model = the object properties from the database, e.g. "content.properties", "tag.properties" etc.
 * fields = the schema properties array
 * modified-flag = boolean value that will be set to true when user modifies any form fields.
 *
 * @returns {{}} Directive Definition Object
 */
function generatedFormDirective() {

    function generatedFormController() {
        var vm = this;

        vm.canUpdate = canUpdate;
        vm.getType = getType;

        /**
         * Does the current user have permission to update this content? If not,
         * form fields are disabled.
         * @returns {boolean}
         */
        function canUpdate() {
            return -1 < vm.perms.indexOf('update');
        }

        /**
         * Get the field data type - used to decide what kind of form input to
         * map the field to.
         * TODO: This is a naive implementation since the final data types are not nailed down yet.
         * @param property
         * @returns {*}
         */
        function getType(property) {
            var type;
            if (property && 50 < property.length) {
                type = "textBlock";
            } else {
                type = "textString";
            }
            return type;
        }
    }

    return {
        restrict: 'E',
        replace: true,
        templateUrl: 'projects/components/generatedForm/generatedForm.html',
        controller: generatedFormController,
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