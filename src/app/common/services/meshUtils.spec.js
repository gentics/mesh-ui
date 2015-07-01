describe('meshUtils', function() {

    /**
     * @type {meshUtils}
     */
    var mu;

    beforeEach(module('meshAdminUi.common'));
    beforeEach(inject(function (_mu_) {
        mu = _mu_;
    }));

    describe('permissionsArrayToKeys method', function() {

        it('should throw on invalid object', function() {
            var invalid = { foo: 'bar' };
            function run() {
                return mu.permissionsArrayToKeys(invalid);
            }

            expect(run).toThrow();
        });

        it('should convert valid perms to keys', function() {
            var item = { perms: ['create', 'read', 'update', 'delete'] };
            var expected = { 'create': true, 'read': true, 'update': true, 'delete': true, perms: ['create', 'read', 'update', 'delete'] };
            var result = mu.permissionsArrayToKeys(item);

            expect(result).toEqual(expected);
        });

        it('should not overwrite existing keys', function() {
            var item = { perms: ['create', 'read', 'update', 'delete'], update: function() {} };
            function run() {
                return mu.permissionsArrayToKeys(item);
            }

            expect(run).toThrow();
        });

        it('should not mutate the original object', function() {
            var item = { perms: ['create', 'read', 'update', 'delete'] };
            mu.permissionsArrayToKeys(item);

            expect(item).toEqual({ perms: ['create', 'read', 'update', 'delete'] });
        });
    });

});