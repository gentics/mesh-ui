describe('selectiveCache', function() {

    var provider;

    beforeEach(module('meshAdminUi.common', function( selectiveCacheProvider ) {
        provider = selectiveCacheProvider;
    }));

    describe('provider config', function() {

        it('setCacheableGroups() accepts hash of <string, Regexp>', inject(function () {
            function configure() {
                provider.setCacheableGroups({
                    a: /a/,
                    b: /b/,
                    c: /c/
                });
            }
            expect(configure).not.toThrow();
        }));

        it('should throw when setCacheableGroups() is passed non-regexp values', function() {
            function configure() {
                provider.setCacheableGroups({
                    a: 'a',
                    b: 'b',
                    c: 'c'
                });
            }
            expect(configure).toThrow();
        });

    });

    describe('service', function() {

        var selectiveCache,
            baseUrl;

        beforeEach(inject(function($cacheFactory, $injector) {
            baseUrl = 'localhost/';
            provider.setCacheableGroups({
                'routeOne': /^route\-one/,
                'routeTwo': /^route\-two\/[0-9]*$/
            });
            provider.setBaseUrl(baseUrl);
            selectiveCache = $injector.invoke(provider.$get);
        }));

        it('should put a cachable url in cache', function() {
            var key = baseUrl + 'route-one/a',
                val = 'a';

            selectiveCache.put(key, val);

            expect(selectiveCache.get(key)).toEqual(val);
        });

        it('should not put non-cachable url in cache', function() {
            var key = baseUrl + 'route-two/a',
                val = 'a';

            selectiveCache.put(key, val);

            expect(selectiveCache.get(key)).toBeUndefined();
        });

        it('should remove based on regexp with remove()', function() {
            var keyBase = baseUrl + 'route-two/';
            for(var i = 0; i < 10; i++) {
                selectiveCache.put(keyBase + i.toString(), i);
            }
            selectiveCache.put('route-one/a', 'a');

            expect(selectiveCache.info().size).toEqual(11);
            var removedCount = selectiveCache.remove('routeTwo');
            expect(selectiveCache.info().size).toEqual(1);
            expect(removedCount).toEqual(10);
        });

        it('should not throw if remove() group not matched', function() {
            function remove() {
                selectiveCache.remove('some/random/url');
            }

            expect(remove).not.toThrow();
        });

    });



});