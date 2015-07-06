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
            var expected = { 'create': true, 'read': true, 'update': true, 'delete': true, rolePerms: ['create', 'read', 'update', 'delete'] };
            var result = mu.rolePermissionsArrayToKeys(item);

            expect(result).toEqual(expected);
        });

        it('should not overwrite existing keys', function() {
            var item = { rolePerms: ['create', 'read', 'update', 'delete'], update: function() {} };
            function run() {
                return mu.rolePermissionsArrayToKeys(item);
            }

            expect(run).toThrow();
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
});