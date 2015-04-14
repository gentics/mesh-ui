angular.module('caiLunAdminUi.projects')
    .directive('generatedForm', generatedFormDirective);

/**
 * The left-hand side navigation for displaying the sub-tags of the current tag.
 *
 * @returns {{}} Directive Definition Object
 */
function generatedFormDirective() {

    function generatedFormController() {
        var vm = this;
        vm.setModifiedFlag = function() {
            vm.modifiedFlag = true;
        };
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
            modifiedFlag: '='
        }
    };
}