angular.module('meshAdminUi.projects.formBuilder')
    .directive('captionedImageWidget', captionedImageWidgetDirective);

/**
 * Custom input widget for captionedImage microschema. Just a demo.
 *
 * @returns {ng.IDirective} Directive definition object
 */
function captionedImageWidgetDirective(nodeSelector) {

    function captionedImageWidgetLinkFn(scope) {
        scope.selectImage = selectImage;

        function selectImage() {
            var options = {
                allow: ['image'],
                displayMode: 'grid',
                title: 'Select An Image'
            };
            event.preventDefault();
            nodeSelector.open(options)
                .then(function(nodes) {
                    scope.microschemaModel.image = nodes[0];
                });
        }
    }

    return {
        restrict: 'E',
        replace: true,
        link: captionedImageWidgetLinkFn,
        templateUrl: 'projects/components/formBuilder/customWidgets/captionedImageWidget.html',
        scope: true
    };
}