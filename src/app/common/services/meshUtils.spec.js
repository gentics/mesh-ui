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

    describe('isImageNode():', function() {

        it('should return false for non-binary node', function() {
            var node = {};
            expect(mu.isImageNode(node)).toEqual(false);
        });

        it('should return false for binary node with non-image mime type', function() {
            var node = {
                binaryProperties: {
                    mimeType: 'application/pdf'
                }
            };
            expect(mu.isImageNode(node)).toEqual(false);
        });

        it('should return true for binary node with jpeg mime type', function() {
            var node = {
                binaryProperties: {
                    mimeType: 'image/jpeg'
                }
            };
            expect(mu.isImageNode(node)).toEqual(true);
        });

        it('should return true for binary node with gif mime type', function() {
            var node = {
                binaryProperties: {
                    mimeType: 'image/gif'
                }
            };
            expect(mu.isImageNode(node)).toEqual(true);
        });

        it('should return true for binary node with png mime type', function() {
            var node = {
                binaryProperties: {
                    mimeType: 'image/png'
                }
            };
            expect(mu.isImageNode(node)).toEqual(true);
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

    describe('clone() method', function() {

        it('should handle primitives', function() {
            expect(mu.clone(1)).toEqual(1);
            expect(mu.clone('a')).toEqual('a');
        });

        it('should handle arrays', function() {
            expect(mu.clone([1,2,3])).toEqual([1,2,3]);
        });

        it('should handle objects', function() {
            expect(mu.clone({foo: 'bar'})).toEqual({foo: 'bar'});
        });

        it('should actually create a new object, not a reference', function() {
            var obj = {foo: 'bar'};
            expect(mu.clone(obj)).not.toBe(obj);
        });

        it('changes to original should not affect clone', function() {
            var obj1 = {foo: 'bar'};
            var obj2 = mu.clone(obj1);

            obj1.foo = 'baz';
            expect(obj2.foo).toBe('bar');
        });
    });
});