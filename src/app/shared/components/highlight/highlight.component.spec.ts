import { createHighlightParts } from './highlight.component';

describe('HighlightComponent:', () => {
    const testString = 'Those who believe in telekinetics, raise my hand';

    describe('createHighlightParts', () => {
        it('should return original string when no matches', () => {
            expect(createHighlightParts(testString, '')).toEqual([{ marker: false, value: testString }]);
            expect(createHighlightParts(testString, 'abc')).toEqual([{ marker: false, value: testString }]);
            expect(createHighlightParts(testString, '.;[]')).toEqual([{ marker: false, value: testString }]);
            expect(createHighlightParts(testString, '😊 👍')).toEqual([{ marker: false, value: testString }]);
        });

        it('should return original string with unexpected term', () => {
            expect(createHighlightParts(testString, <any>1)).toEqual([{ marker: false, value: testString }]);
            expect(createHighlightParts(testString, <any>undefined)).toEqual([{ marker: false, value: testString }]);
            expect(createHighlightParts(testString, <any>null)).toEqual([{ marker: false, value: testString }]);
            expect(createHighlightParts(testString, <any>false)).toEqual([{ marker: false, value: testString }]);
            expect(createHighlightParts(testString, <any>{})).toEqual([{ marker: false, value: testString }]);
            expect(createHighlightParts(testString, <any>[])).toEqual([{ marker: false, value: testString }]);
        });

        it('should handle malformed regex strings', () => {
            expect(createHighlightParts(testString, '[')).toEqual([{ marker: false, value: testString }]);
            expect(createHighlightParts(testString, '(')).toEqual([{ marker: false, value: testString }]);
            expect(createHighlightParts(testString, '[awdad.?(((')).toEqual([{ marker: false, value: testString }]);
            expect(createHighlightParts(testString, 'aw^ dd$ffe')).toEqual([{ marker: false, value: testString }]);
        });

        it('should highlight a matched word', () => {
            expect(createHighlightParts(testString, 'who')).toEqual([
                { marker: false, value: 'Those ' },
                { marker: true, value: 'who' },
                { marker: false, value: ' believe in telekinetics, raise my hand' }
            ]);
            expect(createHighlightParts(testString, 'Those')).toEqual([
                { marker: true, value: 'Those' },
                { marker: false, value: ' who believe in telekinetics, raise my hand' }
            ]);
            expect(createHighlightParts(testString, 'telekinetics')).toEqual([
                { marker: false, value: 'Those who believe in ' },
                { marker: true, value: 'telekinetics' },
                { marker: false, value: ', raise my hand' }
            ]);
            expect(createHighlightParts(testString, 'hand')).toEqual([
                { marker: false, value: 'Those who believe in telekinetics, raise my ' },
                { marker: true, value: 'hand' }
            ]);
        });

        it('should use a case-insensitive match', () => {
            expect(createHighlightParts(testString, 'WHO')).toEqual([
                { marker: false, value: 'Those ' },
                { marker: true, value: 'who' },
                { marker: false, value: ' believe in telekinetics, raise my hand' }
            ]);
            expect(createHighlightParts(testString, 'those')).toEqual([
                { marker: true, value: 'Those' },
                { marker: false, value: ' who believe in telekinetics, raise my hand' }
            ]);
        });

        it('should highlight a matched partial word', () => {
            expect(createHighlightParts(testString, 'tele')).toEqual([
                { marker: false, value: 'Those who believe in ' },
                { marker: true, value: 'tele' },
                { marker: false, value: 'kinetics, raise my hand' }
            ]);
            expect(createHighlightParts(testString, 'nd')).toEqual([
                { marker: false, value: 'Those who believe in telekinetics, raise my ha' },
                { marker: true, value: 'nd' }
            ]);
        });

        it('should highlight multiple matches', () => {
            expect(createHighlightParts(testString, 'h')).toEqual([
                { marker: false, value: 'T' },
                { marker: true, value: 'h' },
                { marker: false, value: 'ose w' },
                { marker: true, value: 'h' },
                { marker: false, value: 'o believe in telekinetics, raise my ' },
                { marker: true, value: 'h' },
                { marker: false, value: 'and' }
            ]);
        });

        it('should highlight term spanning word boundaries', () => {
            expect(createHighlightParts(testString, 'raise my')).toEqual([
                { marker: false, value: 'Those who believe in telekinetics, ' },
                { marker: true, value: 'raise my' },
                { marker: false, value: ' hand' }
            ]);
            expect(createHighlightParts(testString, 'Those who beli')).toEqual([
                { marker: true, value: 'Those who beli' },
                { marker: false, value: 'eve in telekinetics, raise my hand' }
            ]);
        });
    });
});
