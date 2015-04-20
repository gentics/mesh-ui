angular.module('caiLunAdminUi.projects')
    .directive('generatedForm', generatedFormDirective);

/**
 * Component for auto-generating a form from schema data.
 *
 * API:
 * ====
 * model = the object properties from the database, e.g. "content.properties", "tag.properties" etc.
 * fields = the schema properties array
 * modifiedFlag = boolean value that will be set to true when user modifies any form fields.
 *
 * @returns {{}} Directive Definition Object
 */
function generatedFormDirective() {

    function generatedFormController() {
        var vm = this;

        vm.canUpdate = canUpdate;
        vm.setModifiedFlag = setModifiedFlag;

        function setModifiedFlag() {
            vm.modifiedFlag = true;
        }

        function canUpdate() {
            return -1 < vm.perms.indexOf('update');
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
            modifiedFlag: '=',
            perms: '='
        }
    };
}