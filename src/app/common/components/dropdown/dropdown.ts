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
function dropdownController($scope, $element, $document, $window) {
    var vm = this,
        labelElement,
        caretHeight = 15;

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
            $document.on('click', handleClick);
            angular.element($window).on('scroll resize', handleResizeScroll);
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
     */
    function getContentTop(): number {
        return labelElement.offsetHeight - caretHeight;
    }

    function handleClick(event) {
        var target = event.target;
        if (!$element[0].contains(target)) {
            closeDropdown();
        }
    }
    function handleResizeScroll() {
        closeDropdown();
    }

    /**
     * Close the dropdown and de-register the global event handlers.
     */
    function closeDropdown() {
        vm.isOpen = false;
        $document.off('click', handleClick);
        angular.element($window).off('scroll resize', handleResizeScroll);
        if (!$scope.$root.$$phase) {
            $scope.$digest();
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

        const arrowGutter = 15;
        let container = <HTMLElement>element[0];
        let parentContainer = container.parentElement;

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

                let bodyTop = dropdownCtrl.getContentTop() + parentBox.top + window.scrollY + 7;
                let bodyHeight = containerChild.offsetHeight + arrowGutter * 2;
                let bodyWidth = childBox.width + arrowGutter * 2;

                container.style.width = bodyWidth + 'px';
                container.style.height =  bodyHeight + 'px';

                /**
                 * Check to see if the dropdown body goes off the edge of the viewport,
                 * and adjust it if so.
                 */
                if ((parentBox.left + widthDelta) < 0) {
                    container.style.left = parentBox.left - arrowGutter + 'px';
                    container.style.right = 'auto';
                    container.classList.remove('left');
                    container.classList.add('right');
                } else {
                    container.style.left = (parentBox.left + widthDelta - arrowGutter) + 'px';
                }
                /**
                 * Check to see if the dropdown body goes off the bottom of the viewport,
                 * and adjust it if so.
                 */
                if (window.innerHeight + window.scrollY <= bodyTop + bodyHeight) {
                    console.log('Adjusting body', bodyTop + bodyHeight);
                    bodyTop = bodyTop - bodyHeight;
                    container.classList.remove('top');
                    container.classList.add('bottom');
                } else {
                    container.classList.remove('bottom');
                    container.classList.add('top');
                }

                container.style.top = bodyTop + 'px';
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