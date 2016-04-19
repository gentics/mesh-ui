describe('dataService', function() {

    var dataService;

    beforeEach(module('meshAdminUi.common'));
    beforeEach(module('ngFileUpload'));
    beforeEach(inject(function (_dataService_) {
        dataService = _dataService_;
    }));


    describe('filterNodesByLanguage():', function() {

        var nodes;

        beforeEach(function() {
            nodes = [
                { uuid: 'uuid_1', availableLanguages: ['en', 'de', 'fr'], language: 'en' },
                { uuid: 'uuid_1', availableLanguages: ['en', 'de', 'fr'], language: 'de' },
                { uuid: 'uuid_1', availableLanguages: ['en', 'de', 'fr'], language: 'fr' },
                { uuid: 'uuid_2', availableLanguages: ['en'], language: 'en' }
            ];
        });

        it('should not modify an array of nodes with no duplicates', function() {
            var nodes = [
                { uuid: 'uuid_1', availableLanguages: ['en'], language: 'en' },
                { uuid: 'uuid_2', availableLanguages: ['en'], language: 'en' },
                { uuid: 'uuid_3', availableLanguages: ['en'], language: 'en' },
                { uuid: 'uuid_4', availableLanguages: ['en'], language: 'en' }
            ];

            var result = dataService.filterNodesByLanguage(nodes, 'en', 'en');

            expect(result).toEqual(nodes);
        });
        
        it('should keep the version that matches the current language', function() {
            var result = dataService.filterNodesByLanguage(nodes, 'de', 'en');

            expect(result.length).toEqual(2);
            expect(result[0].uuid).toEqual('uuid_1');
            expect(result[0].language).toEqual('de');
            expect(result[1].uuid).toEqual('uuid_2');
        });

        it('should keep the version that matches the default language', function() {
            var result = dataService.filterNodesByLanguage(nodes, 'cz', 'en');

            expect(result.length).toEqual(2);
            expect(result[0].uuid).toEqual('uuid_1');
            expect(result[0].language).toEqual('en');
            expect(result[1].uuid).toEqual('uuid_2');
        });

        it('should keep the version that matches first alphabetical language', function() {
            var result = dataService.filterNodesByLanguage(nodes, 'cz', 'cz');

            expect(result.length).toEqual(2);
            expect(result[0].uuid).toEqual('uuid_1');
            expect(result[0].language).toEqual('en');
            expect(result[1].uuid).toEqual('uuid_2');
        });
    });

});
