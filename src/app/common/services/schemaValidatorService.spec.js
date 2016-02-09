describe('SchemaValidatorService', function() {

    var service;
    var validSchema;

    beforeEach(module('meshAdminUi.common'));
    beforeEach(inject(function (_schemaValidatorService_) {
        service = _schemaValidatorService_;

        validSchema = {
            name: 'testSchema',
            displayField: 'title',
            segmentField: 'title',
            fields: [
                {
                    name: 'title',
                    type: 'string'
                },
                {
                    name: 'members',
                    type: 'list',
                    listType: 'string'
                },
                {
                    name: 'reference',
                    type: 'node',
                    allow: ['otherSchema']
                },
                {
                    name: 'widget',
                    type: 'micronode',
                    allow: ['myWidget']
                },
                {
                    name: 'widgetList',
                    type: 'list',
                    listType: 'micronode',
                    allow: ['myWidget']
                }
            ]
        };
    }));

    describe('validateSchemaJson()', function() {

        it('should return true for valid schema', function() {
            var result = service.validateSchemaJson(JSON.stringify(validSchema));

            expect(result).toBe(true);
        });

        it('should not invoke callback for a valid schema', function() {
            var callback = jasmine.createSpy('spy');
            service.validateSchemaJson(JSON.stringify(validSchema), callback);

            expect(callback).not.toHaveBeenCalled();
        });

        it('should invoke callback once for invalid schema', function() {
            var callback = jasmine.createSpy('spy');
            service.validateSchemaJson('{ 1 }', callback);

            expect(callback.calls.count()).toEqual(1);
        });

        it('should return false on invalid json', function() {
            var result = service.validateSchemaJson('{ 1 }');

            expect(result).toBe(false);
        });

        describe('error conditions', function() {

            function testErrorMessage(badSchema, expectedMessage) {
                var callback = jasmine.createSpy('spy');
                var schemaString = typeof badSchema === 'string' ? badSchema : JSON.stringify(badSchema);
                service.validateSchemaJson(schemaString, callback);

                expect(callback).toHaveBeenCalledWith(expectedMessage);
            }


            it('should display correct error for invalid JSON', function() {
                testErrorMessage('{ 1 }', 'JSON is invalid.');
            });

            it('should display correct error for missing displayField', function() {
                delete validSchema.displayField;
                testErrorMessage(validSchema, 'Please specify a displayField');
            });

            it('should display correct error for empty string displayField', function() {
                validSchema.displayField = '';
                testErrorMessage(validSchema, 'Please specify a displayField.');
            });

            it('should display correct error for non-existent displayField', function() {
                validSchema.displayField = 'foo';
                testErrorMessage(validSchema, 'displayField value "foo" does not match any fields');
            });

            it('should display correct error for wrong data type displayField', function() {
                validSchema.displayField = 42;
                testErrorMessage(validSchema, 'displayField value "42" does not match any fields');
            });

            it('should display correct error for missing segmentField', function() {
                delete validSchema.segmentField;
                testErrorMessage(validSchema, 'Please specify a segmentField');
            });

            it('should display correct error for empty string segmentField', function() {
                validSchema.segmentField = '';
                testErrorMessage(validSchema, 'Please specify a segmentField');
            });

            it('should display correct error for non-existent segmentField', function() {
                validSchema.segmentField = 'foo';
                testErrorMessage(validSchema, 'segmentField value "foo" does not match any fields');
            });

            it('should display correct error for wrong data type segmentField', function() {
                validSchema.segmentField = 42;
                testErrorMessage(validSchema, 'segmentField value "42" does not match any fields');
            });

            it('should display correct error for empty fields array', function() {
                validSchema.fields = [];
                testErrorMessage(validSchema, 'Schema must have at least one field defined');
            });

            it('should display correct error for missing fields array', function() {
                delete validSchema.fields;
                testErrorMessage(validSchema, 'Schema must have at least one field defined');
            });

            it('should display correct error for malformed field (missing name)', function() {
                delete validSchema.fields[1].name;
                testErrorMessage(validSchema, 'All fields must have a "name" and "type" property');
            });

            it('should display correct error for malformed field (missing type)', function() {
                delete validSchema.fields[1].type;
                testErrorMessage(validSchema, 'All fields must have a "name" and "type" property');
            });

            it('should display correct error for malformed field (invalid type)', function() {
                validSchema.fields[1].type = 'foo';
                testErrorMessage(validSchema, 'The following fields have invalid types [members : foo]');
            });

            it('should display correct error for malformed fields (2 x invalid type)', function() {
                validSchema.fields[1].type = 'foo';
                validSchema.fields[2].type = 'bar';
                testErrorMessage(validSchema, 'The following fields have invalid types [members : foo], [reference : bar]');
            });

            it('should display correct error for invalid listType', function() {
                validSchema.fields[1].listType = 'foo';
                testErrorMessage(validSchema, 'The following list fields have an invalid listType [members : foo]');
            });

            it('should display correct error for micronode type without allow property', function() {
                delete validSchema.fields[3].allow;
                delete validSchema.fields[4].allow;
                testErrorMessage(validSchema, 'The following micronode fields must have an "allow" property defined: [widget], [widgetList]');
            });

            it('should display correct error duplicate field names', function() {
                validSchema.fields.push({
                    name: 'title',
                    type: 'string'
                });
                testErrorMessage(validSchema, 'Fields must have unique names - duplicate field detected: [title]');
            });
        });
    });
});
