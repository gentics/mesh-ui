angular.module('meshAdminUi.projects.formBuilder')
    .directive('galleryWidget', galleryWidgetDirective);

/**
 * Custom input widget for gallery microschema. Just a demo.
 *
 * @param {nodeSelector} nodeSelector
 * @returns {ng.IDirective} Directive definition object
 */
function galleryWidgetDirective(nodeSelector) {

    function galleryWidgetLinkFn(scope) {
        var dragStartIndex;

        scope.selectImages = selectImages;
        scope.removeImage = removeImage;
        scope.startDrag = startDrag;
        scope.endDrag = endDrag;

        function selectImages() {
            var options = {
                multiSelect: true,
                allow: ['image'],
                title: 'Select Images',
                displayMode: 'grid'
            };
            event.preventDefault();
            nodeSelector.open(options)
                .then(function(nodes) {
                    nodes.forEach(function(node) {
                        scope.microschemaModel.images.items.push(node);
                    });
                });
        }

        function removeImage(image) {
            var idx = scope.microschemaModel.images.items.indexOf(image);
            scope.microschemaModel.images.items.splice(idx, 1);
        }

        /**
         * Record the index of the item that is being dragged.
         * @param {number} index
         */
        function startDrag(index) {
            dragStartIndex = index;
        }

        /**
         * Remove the original dragged item from the list.
         * @param {Object} item
         * @param {number} dragEndIndex
         * @param {Array<Object>} list
         * @returns {*}
         */
        function endDrag(item, dragEndIndex, list) {
            var indexToSplice;

            if (dragEndIndex < dragStartIndex) {
                indexToSplice = dragStartIndex + 1;
            } else {
                indexToSplice = dragStartIndex;
            }

            list.splice(dragEndIndex, 0, item); // add the new position
            list.splice(indexToSplice, 1); // remove the old position
            scope.formBuilder.modified = true;
        }
    }

    return {
        restrict: 'E',
        replace: true,
        link: galleryWidgetLinkFn,
        templateUrl: 'projects/components/formBuilder/customWidgets/galleryWidget.html',
        scope: true
    };
}