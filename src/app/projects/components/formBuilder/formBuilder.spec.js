describe('formBuilder Module', function() {

    var $compile,
        $scope,
        $timeout,
        containingElement;

    beforeEach(module('meshAdminUi.projects.formBuilder'));
    beforeEach(module('ngMaterial'));
    beforeEach(module('meshAdminUi.templates'));

    beforeEach(inject(function($rootScope, _$compile_, _$timeout_) {

        $compile = _$compile_;
        $timeout = _$timeout_;
        $scope = $rootScope.$new();
        containingElement = document.createElement('div');
    }));

    function compileElement(fields, model) {
        var html;
        $scope.fields = fields;
        $scope.model = model;
        $scope.perms = ["read", "create", "update", "delete"];
        $scope.state = {
            modified: false
        };

        html = '<form-builder model="model" fields="fields" modified-flag="state.modified" perms="perms"></form-builder>';

        angular.element(containingElement).append($compile(html)($scope));
        $scope.$apply();
    }

    describe('common input properties', function() {

        beforeEach(function() {
            var fields = [{
                "name": "myInput",
                "label": "An Input Field",
                "type": "string"
            }];

            var model = {
                "myInput": "foo"
            };

            compileElement(fields, model);
        });

        it('should populate with correct value', function() {
            expect(containingElement.querySelector('input[type="text"]').value).toEqual('foo');
        });

        it('should populate with correct label', function() {
            expect(containingElement.querySelector('label').innerHTML).toEqual('An Input Field');
        });

        it('should set modified flat when modified', function() {
            var input = angular.element(containingElement.querySelector('input[type="text"]'));

            expect($scope.state.modified).toEqual(false);
            $scope.$apply(function() {
                input.val('bar');
                input.triggerHandler('change');
            });
            expect($scope.state.modified).toEqual(true);
        });
    });

    it('should generate a html type field', function() {
        var fields = [{
            "name": "html",
            "label": "HTML Type",
            "type": "html"
        }];

        var model = {
            "html": "<p>hello</p>"
        };

        compileElement(fields, model);
        expect(containingElement.querySelector('textarea').value).toEqual('<p>hello</p>');
    });

    it('should generate a number type field', function() {
        var fields = [{
            "name": "number",
            "label": "Number Type",
            "type": "number"
        }];

        var model = {
            "number": 42
        };

        compileElement(fields, model);
        expect(containingElement.querySelector('input[type="number"]').value).toEqual('42');
    });

    it('should generate a boolean type field', function() {
        var fields = [{
            "name": "boolean",
            "label": "Boolean Type",
            "type": "boolean"
        }];

        var model = {
            "boolean": true
        };

        compileElement(fields, model);
        expect(containingElement.querySelector('md-checkbox').classList).toContain('md-checked');
    });

    it('should generate a date type field', function() {
        var timestamp = 1433336633;
        var fields = [{
            "name": "date",
            "label": "Date Type",
            "type": "date"
        }];

        var model = {
            "date": timestamp
        };

        compileElement(fields, model);
        expect(containingElement.querySelector('input[type="date"]').value).toEqual(getDateString(timestamp));

    });
});

// utilities
function getDateString(timeStampInSeconds) {
    var dateObject = new Date(timeStampInSeconds * 1000);
    console.log(dateObject);
    return pad(dateObject.getFullYear(), 4) + '-' + pad(dateObject.getMonth() + 1, 2) + '-' + pad(dateObject.getDay(), 2);
}

/**
 * http://stackoverflow.com/a/10073788/772859
 * @param n
 * @param width
 * @param z
 * @returns {string}
 */
function pad(n, width, z) {
    z = z || '0';
    n = n + '';
    return n.length >= width ? n : new Array(width - n.length + 1).join(z) + n;
}