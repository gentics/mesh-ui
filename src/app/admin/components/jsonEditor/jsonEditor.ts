module meshAdminUi {

    declare var Behave: any;
    declare var BehaveHooks: any;

    class JsonEditorController {

        public contents: string;
        private editor: any;

        constructor($scope: ng.IScope) {

            let unwatch = $scope.$watch(() => this.contents, val => {
               if (typeof val !== 'undefined') {
                   this.initBehave();
                   unwatch();
               }
            });

            $scope.$on('$destroy', () => {
                console.log('destroying behave editor');
                this.editor.destroy();
            });
        }

        private initBehave() {

            const autoSize = (data) => {
                console.log('yolo');
                var numLines = data.lines.total,
                    fontSize = parseInt( getComputedStyle(data.editor.element)['font-size'] ) * 1.25,
                    padding = parseInt( getComputedStyle(data.editor.element)['padding'] );
                data.editor.element.style.height = (((numLines*fontSize)+padding))+'px';
            };

            /*
             * This hook adds autosizing functionality
             * to your textarea
             */
            BehaveHooks.add(['keydown'], autoSize);
            BehaveHooks.add(['init:after'], autoSize);


            this.editor = new Behave({
                textarea: document.getElementById('mh-json-editor'),
                tabSize: 2,
            });
        }
    }

    function jsonEditorDirective() {
        return {
            restrict: 'E',
            templateUrl: 'admin/components/jsonEditor/jsonEditor.html',
            controller: 'JsonEditorController',
            controllerAs: 'vm',
            bindToController: true,
            scope: {
                contents: '='
            }
        };
    }

    angular.module('meshAdminUi.admin')
        .directive('jsonEditor', jsonEditorDirective)
        .controller('JsonEditorController', JsonEditorController);
}