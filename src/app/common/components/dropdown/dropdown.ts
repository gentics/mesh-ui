angular.module('meshAdminUi.common')
    .controller('mhDropdownController', dropdownController)
    .directive('mhDropdown', dropdownDirective)
    .directive('mhDropdownLabel', dropdownLabelDirective)
    .directive('mhDropdownBody', dropdownBodyDirective);

/**
 * Controller for the mh-dropdown component. The component expects the following markup:
 * TODO: needs refactoring to proper TypeScript form.
 *
 * <mh-dropdown>
 *    <mh-dropdown-label>
 *        Label
 *    </mh-dropdown-label>
 *    <mh-dropdown-body>
 *        <ul>
 *            <li>Option 1</li>
 *            <li>Option 2</li>
 *        </ul>
 *    </mh-dropdown-body>
 * </mh-dropdown>
 *
 * Options:
 * =======
 *
 * sticky: boolean - if true, dropdown will not close unless clicked outside of.
 */
function dropdownController($scope, $element, $document) {
    var vm = this,
        labelElement,
        caretHeight = 12;

    /**
     * Tracks the state of the dropdown
     */
    vm.isOpen = false;

    vm.align = vm.align || 'left';
    vm.sticky = vm.sticky || false;


    vm.toggle = toggle;
    vm.setLabelElement = setLabelElement;
    vm.getContentTop = getContentTop;

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
     * Keep a reference to the label element, used for
     * correct positioning of the dropdown content div.
     * @type {number}
     */
    function setLabelElement(element) {
        labelElement = element;
    }

    /**
     * Get the top position of the content div, which is based on the
     * height of the label element.
     * @returns {number}
     */
    function getContentTop() {
        return labelElement.offsetHeight - caretHeight;
    }

    /**
     * Close the dropdown and de-register the global click handler.
     * @param {Event} event
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
 * The container for the whole dropdown component. Its main purpose is to
 * establish an isolate scope and make the shared controller available
 * to the other parts of the component.
 *
 * @returns {ng.IDirective} Directive definition object
 */
function dropdownDirective() {

    return {
        restrict: 'E',
        template: '<div class="mh-dropdown" ng-transclude></div>',
        controller: 'mhDropdownController',
        controllerAs: 'vm',
        bindToController: true,
        transclude: true,
        replace: true,
        scope: {
            sticky: '='
        }
    };
}

/**
 * The dropdown label
 *
 * @returns {ng.IDirective} Directive definition object
 */
function dropdownLabelDirective() {
    function dropdownLabelLink(scope, element, attrs, dropdownCtrl) {
        dropdownCtrl.setLabelElement(element[0]);
        scope.dropdown = dropdownCtrl;
    }
    return {
        restrict: 'E',
        template: '<div class="mh-dropdown-label" ng-click="dropdown.toggle()" ng-class="{ open: dropdown.isOpen }"><a href="" class="a-plain" ng-transclude></a></div>',
        transclude: true,
        replace: true,
        require: '^^mhDropdown',
        link: dropdownLabelLink,
        scope: {}
    };
}

/**
 * The dropdown body.
 *
 * @returns {ng.IDirective} Directive definition object
 */
function dropdownBodyDirective() {
    function linkFn(scope, element, attrs, dropdownCtrl) {

        let container = <HTMLElement>element[0];
        let parentContainer = container.parentElement.parentElement;

        const clickHandler = (e: Event) => {
            e.stopPropagation();
            if (!dropdownCtrl.sticky) {
                scope.$apply(function() {
                    dropdownCtrl.toggle();
                });
            }
        };
        container.remove();

        scope.dropdown = dropdownCtrl;
        scope.$watch('dropdown.isOpen', setPosition);
        scope.$on('$destroy', () => {
            element.off('click', clickHandler);
        });
        element.on('click', clickHandler);

        function setPosition(isOpen) {
            if (isOpen) {
                document.body.appendChild(container);
                let containerChild = <HTMLElement>container.children[0];
                let parentBox = parentContainer.getBoundingClientRect();
                let childBox = containerChild.getBoundingClientRect();
                let widthDelta = parentBox.width - childBox.width;

                container.style.top = (dropdownCtrl.getContentTop() + parentBox.top) + 'px';
                container.style.width = childBox.width + 'px';
                container.style.height =  containerChild.offsetHeight + 12 + 'px';

                /**
                 * Check to see if the dropdown body goes off the edge of the viewport,
                 * and adjust it if so.
                 */
                if ((parentBox.left + widthDelta) < 0) {
                    container.style.left = parentBox.left + 'px';
                    container.style.right = 'auto';
                    container.classList.remove('left');
                    container.classList.add('right');
                } else {
                    container.style.left = (parentBox.left + widthDelta) + 'px';
                }

                container.classList.add('open');
            } else {
                container.remove();
                container.style.height = '0';
                container.classList.remove('open');
            }
        }


    }
    return {
        restrict: 'AE',
        template: '<div class="mh-dropdown-body left"><div class="contents" ng-transclude></div></div>',
        scope: {},
        replace: true,
        transclude: true,
        require: '^^mhDropdown',
        link: linkFn
    };
}