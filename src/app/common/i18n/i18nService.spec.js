describe('i18nService', function() {

    var provider;

    beforeEach(module('meshAdminUi.common', function( i18nServiceProvider ) {
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

        beforeEach(inject(function($injector) {
            provider.setAvailableLanguages(['en', 'de', 'da']);
            provider.setDefaultLanguage('en');
            i18nService = $injector.invoke(provider.$get);
        }));

        it('should set new language if valid code', function() {
            i18nService.setCurrentLang('de');
            expect(i18nService.getCurrentLang().code).toEqual('de');
        });

        it('should return language object with name and nativeName', function() {
            i18nService.setCurrentLang('de');
            expect(i18nService.getCurrentLang().name).toEqual('German');
            expect(i18nService.getCurrentLang().nativeName).toEqual('Deutsch');
        });

        it('should throw on invalid language', function() {
            function badCall() {
                i18nService.setCurrentLang('zz')
            }
            expect(badCall).toThrow();
        });

        it('should provide a list of available languages from .languages getter', function() {
            var availableLangs = i18nService.languages;

            expect(availableLangs[0]).toEqual(jasmine.objectContaining({ code: 'en', name: 'English', nativeName: 'English'}));
            expect(availableLangs[1]).toEqual(jasmine.objectContaining({ code: 'de', name: 'German', nativeName: 'Deutsch'}));
            expect(availableLangs[2]).toEqual(jasmine.objectContaining({ code: 'da', name: 'Danish', nativeName: 'dansk'}));
        });

    });



});