describe('meshUtils', function() {
    var mu;

    beforeEach(module('meshAdminUi.common'));
    beforeEach(inject(function (_mu_) {
        mu = _mu_;
    }));

    describe('rolePermissionsArrayToKeys method', function() {

        it('should throw on invalid object', function() {
            var invalid = { foo: 'bar' };
            function run() {
                return mu.rolePermissionsArrayToKeys(invalid);
            }

            expect(run).toThrow();
        });

        it('should convert valid perms to keys', function() {
            var item = { rolePerms: ['create', 'read', 'update', 'delete'] };
            var expected = { 'create': true, 'read': true, 'update': true, 'delete': true };
            var result = mu.rolePermissionsArrayToKeys(item);

            expect(result).toEqual(expected);
        });

        it('should not mutate the original object', function() {
            var item = { rolePerms: ['create', 'read', 'update', 'delete'] };
            mu.rolePermissionsArrayToKeys(item);

            expect(item).toEqual({ rolePerms: ['create', 'read', 'update', 'delete'] });
        });
    });

    describe('flatten method', function() {

        it('should work on 1D array', function() {
            var arr = [1, 2, 3];
            var expected = [1, 2, 3];
            var result = mu.flatten(arr);

            expect(result).toEqual(expected);
        });

        it('should work on 2D array', function() {
            var arr = [[1, 2], ['a', 'b']];
            var expected = [1, 2, 'a', 'b'];
            var result = mu.flatten(arr);

            expect(result).toEqual(expected);
        });

        it('should work on irregular 3D array', function() {
            var arr = [1, ['a', 'b'], [['foo', 'bar', [10, 11]], 'quux'], 'z'];
            var expected = [1, 'a', 'b', 'foo', 'bar', 10, 11, 'quux', 'z'];
            var result = mu.flatten(arr);

            expect(result).toEqual(expected);
        });

        it('should throw if argument is not an array', function() {
            var notArr = 'hello';
            function run() {
                mu.flatten(notArr);
            }

            expect(run).toThrow();
        });
    });

    describe('getFirstBinaryField():', function() {

        var binaryNode;

        beforeEach(function() {
            binaryNode = {
                uuid: 'binary_node_uuid',
                fields: {
                    name: 'foo',
                    image: {
                        fileName: 'image.jpg',
                        fileSize: 4200,
                        mimeType: 'image/jpeg',
                        sha512sum: '1243123123123'
                    },
                    document: {
                        fileName: 'doc.pdf',
                        fileSize: 333,
                        mimeType: 'application/pdf',
                        sha512sum: '441515151515'
                    }
                }
            };
        });

        it('should return undefined if no binary fields', function() {
            var node = {
                uuid: 'some_uuid',
                fields: {
                    name: 'foo'
                }
            };
            var result = mu.getFirstBinaryField(node);

            expect(result.key).toBeUndefined();
            expect(result.value).toBeUndefined();
        });

        it('should return first binary field key', function() {
            var result = mu.getFirstBinaryField(binaryNode);

            expect(result.key).toBe('image');
        });

        it('should return first binary field value', function() {
            var result = mu.getFirstBinaryField(binaryNode);

            expect(result.value).toEqual(binaryNode.fields.image);
        });
    });

    describe('isImageField():', function() {

        it('should return false for non-binary field', function() {
            var field = {};
            expect(mu.isImageField(field)).toEqual(false);
        });

        it('should return false for binary field with non-image mime type', function() {
            var field = {
                mimeType: 'application/pdf'
            };
            expect(mu.isImageField(field)).toEqual(false);
        });

        it('should return true for binary field with jpeg mime type', function() {
            var field = {
                mimeType: 'image/jpeg'
            };
            expect(mu.isImageField(field)).toEqual(true);
        });

        it('should return true for binary field with gif mime type', function() {
            var field = {
                mimeType: 'image/gif'
            };
            expect(mu.isImageField(field)).toEqual(true);
        });

        it('should return true for binary field with png mime type', function() {
            var field = {
                mimeType: 'image/png'
            };
            expect(mu.isImageField(field)).toEqual(true);
        });

    });

    describe('nodeTagsObjectToArray()', function() {

        var tagsObject;

        beforeEach(function() {
            tagsObject = {
                colors: {
                    items: [
                        { name: 'red', uuid: 'red_uuid' },
                        { name: 'green', uuid: 'green_uuid' },
                        { name: 'blue', uuid: 'blue_uuid' }
                    ],
                    uuid: 'colors_uuid'
                },
                sizes: {
                    items: [
                        { name: 'small', uuid: 'small_uuid' },
                        { name: 'medium', uuid: 'medium_uuid' },
                        { name: 'large', uuid: 'large_uuid' }
                    ],
                    uuid: 'sizes_uuid'
                }
            };
        });

        it('should return empty array for undefined object', function() {
            var result = mu.nodeTagsObjectToArray(undefined);
            expect(result).toEqual([]);
        });

        it('should return empty array for empty object', function() {
            var result = mu.nodeTagsObjectToArray({});
            expect(result).toEqual([]);
        });

        it('should return an array', function() {
            var result = mu.nodeTagsObjectToArray(tagsObject);
            expect(result instanceof Array).toEqual(true);
        });

        it('should return the correct number of items', function() {
            var result = mu.nodeTagsObjectToArray(tagsObject);
            expect(result.length).toEqual(6);
        });

        it('the items should all have the correct shape', function() {
            var result = mu.nodeTagsObjectToArray(tagsObject);
            var correctShape = result.filter(function(item) {
                return (item.uuid &&
                item.fields.name &&
                item.tagFamily.name &&
                item.tagFamily.uuid );
            });
            expect(correctShape.length).toBe(6);
        });

        it('the first item should have the correct properties', function() {
            var result = mu.nodeTagsObjectToArray(tagsObject);
            var expected = {
                uuid: 'red_uuid',
                fields: { name: 'red' },
                tagFamily: { name: 'colors', uuid: 'colors_uuid' }
            };

            expect(result[0]).toEqual(expected);
        });

    });

    describe('safeClone() method', function() {

        it('should handle primitives', function() {
            expect(mu.safeClone(1)).toEqual(1);
            expect(mu.safeClone('a')).toEqual('a');
        });

        it('should handle arrays', function() {
            expect(mu.safeClone([1,2,3])).toEqual([1,2,3]);
        });

        it('should handle objects', function() {
            expect(mu.safeClone({foo: 'bar'})).toEqual({foo: 'bar'});
        });

        it('should handle native Blob object', function() {
            var blob = new Blob(['foo']);
            var clone;
            function doClone() {
                clone = mu.safeClone(blob);
            }
            expect(doClone).not.toThrow();
            expect(clone.size).toBe(3);
        });

        it('should actually create a new object, not a reference', function() {
            var obj = {foo: 'bar'};
            expect(mu.safeClone(obj)).not.toBe(obj);
        });

        it('changes to original should not affect safeClone', function() {
            var obj1 = {foo: 'bar'};
            var obj2 = mu.safeClone(obj1);

            obj1.foo = 'baz';
            expect(obj2.foo).toBe('bar');
        });
    });

    describe('matchProps()', function() {

        var obj;

        beforeEach(function() {
            obj = {
                foo: 'hello',
                bar: 'hi',
                quux: 'wassup'
            };
        });

        it('should return true for empty filter text', function() {
            var result = mu.matchProps(obj, ['foo'], '');
            expect(result).toBe(true);
        });

        it('should return true for null filter text', function() {
            var result = mu.matchProps(obj, ['foo'], null);
            expect(result).toBe(true);
        });

        it('should return true for undefined filter text', function() {
            var result = mu.matchProps(obj, ['foo'], undefined);
            expect(result).toBe(true);
        });

        it('should filter on specified properties', function() {
            var result = mu.matchProps(obj, ['foo'], 'h');
            expect(result).toBe(true);
        });

        it('should not filter on unspecified properties', function() {
            var result = mu.matchProps(obj, ['quux'], 'h');
            expect(result).toBe(false);
        });

        it('should match anywhere in string', function() {
            var result = mu.matchProps(obj, ['foo'], 'lo');
            expect(result).toBe(true);
        });

        it('should not throw on unexpected data types', function() {
            var otherObj = { foo: 42, bar: new Date(), baz: true, quux: [1, 2, 3] };
            var result;
            function run() {
                result = mu.matchProps(otherObj, ['foo', 'bar', 'baz', 'quux'], 'test');
            }

            expect(run).not.toThrow();
            expect(result).toBe(false);
        });

        it('should match in a case-insensitive fashion', function() {
            var result = mu.matchProps(obj, ['foo'], 'H');
            expect(result).toBe(true);
        });
    });

    describe('sortLanguages()', function() {

        var availableLangs = [
            {
                code: 'ps',
                name: "Pashto, Pushto",
                nativeName: "پښتو"
            },
            {
                code: 'am',
                name: "Amharic",
                nativeName: "አማርኛ"
            },
            {
                code: 'lo',
                name: "Lao",
                nativeName: "ພາສາລາວ"
            },
            {
                code: 'eo',
                name: "Esperanto",
                nativeName: "Esperanto"
            }
        ];

        it('should sort strings into alphabetical order', function() {
            var langStrings = availableLangs.map(function(l) { return l.code; });
            var result = mu.sortLanguages(langStrings);

            expect(result).toEqual(['am', 'eo', 'lo', 'ps']);
        });

        it('should sort ILanguageInfo objects into alphabetical order', function() {
            var result = mu.sortLanguages(availableLangs);

            expect(result).toEqual(['am', 'eo', 'lo', 'ps']);
        });

        it('should put currentLang first with strings', function() {
            var langStrings = availableLangs.map(function(l) { return l.code; });
            var result = mu.sortLanguages(langStrings, 'eo');

            expect(result).toEqual(['eo', 'am', 'lo', 'ps']);
        });

        it('should put currentLang first with ILanguageInfo objects', function() {
            var result = mu.sortLanguages(availableLangs, 'eo');

            expect(result).toEqual(['eo', 'am', 'lo', 'ps']);
        });
    });

    describe('addSuffixToString()', function() {

        it('should add suffix to string without period', function() {
            var result = mu.addSuffixToString('foo', 'bar');

            expect(result).toBe('foo_bar');
        });

        it('should add suffix to string with period', function() {
            var result = mu.addSuffixToString('foo.ext', 'bar');

            expect(result).toBe('foo.bar.ext');
        });

        it('should work with a custom delimiter', function() {
            var result = mu.addSuffixToString('foo', 'bar', '!');

            expect(result).toBe('foo!bar');
        });
    });

    describe('safeCloneNode()', function() {
        var originalNode;
        var schema;

        beforeEach(function() {
            originalNode = {
                fields: {
                    name: 'foo',
                    fileName: 'foo.txt',
                    other: 'bar',
                    image: {
                        fileName: 'image.jpg',
                        sha512sum: '124124124'
                    }
                }
            };

            schema = {
                displayField: 'name',
                segmentField: 'fileName',
                fields: [
                    { name: 'name', type: 'string'},
                    { name: 'fileName', type: 'string'},
                    { name: 'other', type: 'string'},
                    { name: 'image', type: 'binary'}
                ]
            };

            // suppress warnings from testing output
            spyOn(console, 'warn');
        });


        it('should return a copy of the node', function() {
            var result = mu.safeCloneNode(originalNode, schema, 'suffix');
            expect(result === originalNode).toBe(false);
        });

        it('should rename the displayField', function() {
            var result = mu.safeCloneNode(originalNode, schema, 'suffix');
            expect(result.fields.name).toBe('foo (suffix)');
        });

        it('should rename the displayField when segmentField is undefined', function() {
            delete schema.segmentField;
            var result = mu.safeCloneNode(originalNode, schema, 'suffix');
            expect(result.fields.name).toBe('foo (suffix)');
        });

        it('should rename the segmentField', function() {
            var result = mu.safeCloneNode(originalNode, schema, 'suffix');
            expect(result.fields.fileName).toBe('foo.suffix.txt');
        });

        it('should leave other fields unchanged', function() {
            var result = mu.safeCloneNode(originalNode, schema, 'suffix');
            expect(result.fields.other).toBe('bar');
        });

        it('should rename fileName of a binary segmentField', function() {
            schema.segmentField = 'image';
            var result = mu.safeCloneNode(originalNode, schema, 'suffix');
            expect(result.fields.image.fileName).toBe('image.suffix.jpg');
        });
    });

    describe('getPointerByPath()', function() {

        var testObject = {
            name: 'Joe',
            friends: [
                { name: 'Judy', age: 44 },
                { name: 'Sarah', age: 23 }
            ],
            employer: {
                addresses: [
                    {
                        postcode: '123445'
                    }
                ]
            }
        };

        it('should return pointer for top level', function() {
            var result = mu.getPointerByPath(testObject, ['name']);
            expect(result).toBe(testObject);
        });

        it('should return pointer for second level list', function() {
            var result = mu.getPointerByPath(testObject, ['friends', 1]);
            expect(result).toBe(testObject.friends);
        });

        it('should return pointer for second level list property', function() {
            var result = mu.getPointerByPath(testObject, ['friends', 1, 'name']);
            expect(result).toBe(testObject.friends[1]);
        });

        it('should return pointer for second level object property', function() {
            var result = mu.getPointerByPath(testObject, ['employer', 'addresses', 0, 'postcode']);
            expect(result).toBe(testObject.employer.addresses[0]);
        });
    });
});