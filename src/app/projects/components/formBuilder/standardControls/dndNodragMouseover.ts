/**
 * Hacky fix for an issue in IE/Edge and FireFox, whereby the text in any text input which has an ancestor with
 * `draggable=true` cannot be selected. In fact, the input no longer responds to mouse clicks at all.
 *
 * This is discussed in the following thread, which is the source of this workaround:
 * https://github.com/marceljuenemann/angular-drag-and-drop-lists/issues/127#issuecomment-295234653
 */
angular.module('meshAdminUi.projects.formBuilder')
    .directive('dndNodragMouseover', function(){
        return {
            restrict: 'A',
            require: 'dndNodragMouseover',
            controller: function ( $element ) {

                this.ancestors = [];

                this.findDraggableAncestorsUntilDndDraggable = ( h ) => {
                    let a = [];
                    while ( !!h[0] ) {
                        if ( h.attr('draggable') !== undefined ) {
                            a.push({
                                element : h,
                                draggable : h.attr('draggable')
                            });
                        }
                        if ( h.attr('dnd-draggable') !== undefined ) {
                            break;
                        }
                        h = h.parent();
                    }
                    return a;
                };

                this.cleanup = function () {
                    this.ancestors = [];
                };

                this.removeDraggable = () => {
                    this.ancestors = this.findDraggableAncestorsUntilDndDraggable( $element );
                    this.ancestors.forEach(function(o){
                        o.element.attr('draggable', 'false');
                    });
                };

                this.restoreDraggable = function () {
                    this.ancestors.forEach(function(o){
                        o.element.attr('draggable', o.draggable);
                    });
                };

            },
            link: function (scope, iElement, iAttrs, controller: any) {
                iElement.on('mouseover', function(event){
                    controller.removeDraggable();
                });
                iElement.on('mouseout', function(event){
                    controller.restoreDraggable();
                });
                scope.$on('$destroy', function(){
                    iElement.off('mouseover');
                    iElement.off('mouseout');
                    controller.cleanup();
                });
            }
        };
    });
