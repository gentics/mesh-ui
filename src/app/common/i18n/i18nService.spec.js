describe('i18nService', function() {

    var provider;

    beforeEach(module('caiLunAdminUi.common', function( i18nServiceProvider ) {
        provider = i18nServiceProvider;
    }));

    describe('provider config', function() {

        it('setDefaultLanguage accepts a valid language code', inject(function () {
            function configure() {
                provider.setDefaultLanguage('en');
            }
            expect(configure).not.toThrow();
        }));

        it('setDefaultLanguage throws on invalid language code', inject(function () {
            function configure() {
                provider.setDefaultLanguage('zz');
            }
            expect(configure).toThrow();
        }));

        it('setAvailableLanguages throws on non-array argument', inject(function () {
            function configure() {
                provider.setAvailableLanguages('not an array');
            }
            expect(configure).toThrow();
        }));

    });

    describe('service', function() {

        var i18nService;

        beforeEach(function() {
            provider.setDefaultLanguage('en');
            i18nService = provider.$get();
        });

        it('should return default language', function() {
            expect(i18nService.getLanguage()).toEqual('en');
        });

        it('should set new language if valid code', function() {
            i18nService.setLanguage('de');
            expect(i18nService.getLanguage()).toEqual('de');
        });

        it('should throw on invalid language', function() {
            function badCall() {
                i18nService.setLanguage('zz')
            }
            expect(badCall).toThrow();
        });

    });



});