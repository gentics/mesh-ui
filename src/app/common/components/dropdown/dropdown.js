angular.module('caiLunAdminUi.common')
    .directive('mhDropdown', dropdownDirective)
    .directive('mhDropdownLabel', dropdownLabelDirective)
    .directive('mhDropdownOptions', dropdownOptionsDirective);


/* TODO: build custom dropdown element with the following markup:
 <mh-dropdown>
    <mh-dropdown-label>
        {{ vm.userName }}
    </mh-dropdown-label>
    <ul mh-dropdown-options>
        <li>PROFILE</li>
        <li>LOG_OUT</li>
    </ul>
 </mh-dropdown>
 */

function dropdownController() {
    var dropdown = this;

    dropdown.open = false;
}

/**
 * Directive to create a dropdown menu of items
 *
 * @returns {{}} Directive Definition Object
 */
function dropdownDirective() {

    return {
        restrict: 'E',
        templateUrl: 'common/components/dropdown/dropdown.html',
        controller: dropdownController,
        controllerAs: 'dropdown',
        transclude: true,
        scope: {}
    };
}

function dropdownLabelDirective() {
    return {
        restrict: 'E',
        template: '<span ng-click="dropdown.open = true"><ng-transclude></ng-transclude><i class="icon-arrow-drop-down"></i></span>',
        transclude: true,
        controller: dropdownController
    };
}

function dropdownOptionsDirective() {
    return {
        restrict: 'A',
        template: '<span ng-class="{ open: true }" ng-transclude></span>',
        controller: dropdownController,
        controllerAs: 'vm',
        scope: true,
        transclude: true
    };
}