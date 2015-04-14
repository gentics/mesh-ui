describe('selectiveCache', function() {

    var provider;

    beforeEach(module('caiLunAdminUi.common', function( selectiveCacheProvider ) {
        provider = selectiveCacheProvider;
    }));

    describe('provider config', function() {

        it('setCacheableUrls() accepts array of Regexps', inject(function () {
            function configure() {
                provider.setCacheableUrls([/a/, /b/, /c/]);
            }
            expect(configure).not.toThrow();
        }));

        it('should throw when setCacheableUrls() is passed non-regexp values', function() {
            function configure() {
                provider.setCacheableUrls(['a', 'b', 'c']);
            }
            console.log('ribbit');
            expect(configure).toThrow();
        });

    });

    describe('service', function() {

        var selectiveCache,
            baseUrl;

        beforeEach(inject(function($cacheFactory) {
            baseUrl = 'localhost/';
            provider.setCacheableUrls([
                /^route\-one/,
                /^route\-two\/[0-9]*$/
            ]);
            provider.setBaseUrl(baseUrl);
            selectiveCache = provider.$get($cacheFactory);
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
            var removedCount = selectiveCache.remove(/^route\-two\/[0-9]*$/);
            expect(selectiveCache.info().size).toEqual(1);
            expect(removedCount).toEqual(10);
        });

    });



});