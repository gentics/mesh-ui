angular.module('caiLunAdminUi.common')
    .controller('mhDropdownController', dropdownController)
    .directive('mhDropdown', dropdownDirective)
    .directive('mhDropdownLabel', dropdownLabelDirective)
    .directive('mhDropdownOptions', dropdownOptionsDirective);

/**
 * Controller for the mh-dropdown component. The component expects the following markup:
 *
 * <mh-dropdown>
 *    <mh-dropdown-label>
 *        Label
 *    </mh-dropdown-label>
 *    <div mh-dropdown-options>
 *        <ul>
 *            <li>Option 1</li>
 *            <li>Option 2</li>
 *        </ul>
 *    </div>
 * </mh-dropdown>
 *
 * @param $scope
 * @param $element
 * @param $document
 */
function dropdownController($scope, $element, $document) {
    var vm = this;

    vm.isOpen = false;
    vm.labelHeight = 0;
    vm.toggle = toggle;

    /**
     * Toggle the open state of the dropdown and register a
     * global click handler to close.
     */
    function toggle() {
        vm.isOpen = !vm.isOpen;
        if (vm.isOpen) {
            $document.on('click', closeDropdown);
        }
    }

    /**
     * Close the dropdown and deregister the global click handler.
     * @param event
     */
    function closeDropdown(event) {
        var target = event.target;
        if (!$element[0].contains(target)) {
            vm.isOpen = false;
            $scope.$digest(function() {
                $document.off('click', closeDropdown);
            });
        }
    }
}

/**
 * The container for the dropdown
 *
 * @returns {{}} Directive Definition Object
 */
function dropdownDirective() {
    return {
        restrict: 'E',
        template: '<ng-transclude class="mh-dropdown"></ng-transclude>',
        controller: 'mhDropdownController',
        transclude: true,
        replace: true,
        scope: {}
    };
}

/**
 * The dropdown label
 *
 * @returns {{restrict: string, template: string, transclude: boolean, replace: boolean, require: string, link: dropdownLabelLink, scope: {}}}
 */
function dropdownLabelDirective() {
    function dropdownLabelLink(scope, element, attrs, dropdownCtrl) {
        dropdownCtrl.labelHeight = element[0].offsetHeight;
        scope.dropdown = dropdownCtrl;
    }
    return {
        restrict: 'E',
        template: '<div class="mh-dropdown-label" ng-click="dropdown.toggle()" ng-class="{ open: dropdown.isOpen }" ng-transclude></div>',
        transclude: true,
        replace: true,
        require: '^^mhDropdown',
        link: dropdownLabelLink,
        scope: {}
    };
}

/**
 * The dropdown options.
 *
 * @returns {{restrict: string, template: string, scope: {}, replace: boolean, transclude: boolean, require: string, link: linkFn}}
 */
function dropdownOptionsDirective() {
    function linkFn(scope, element, attrs, dropdownCtrl) {
        var container = element[0],
            contentsHeight = container.children[0].offsetHeight;

        scope.dropdown = dropdownCtrl;
        container.style.top = dropdownCtrl.labelHeight + 'px';

        scope.$watch('dropdown.isOpen', setHeight);

        function setHeight(isOpen) {
            if (isOpen) {
                container.style.height =  contentsHeight + 'px';
            } else {
                container.style.height = 0;
            }
        }
    }
    return {
        restrict: 'A',
        template: '<div class="mh-dropdown-options" ng-transclude></div>',
        scope: {},
        replace: true,
        transclude: true,
        require: '^^mhDropdown',
        link: linkFn
    };
}