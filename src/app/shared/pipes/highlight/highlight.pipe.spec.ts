import { TestBed } from '@angular/core/testing';

import { HighlightPipe } from './highlight.pipe';

describe('HighlightPipe:', () => {
    const open = '<span class="hl-pipe">';
    const close = '</span>';
    let highlightPipe: HighlightPipe;
    const testString = 'Those who believe in telekinetics, raise my hand';

    beforeEach(() => {
        TestBed.configureTestingModule({
            providers: [HighlightPipe]
        });
        highlightPipe = TestBed.get(HighlightPipe);
    });

    it('should return original string when no matches', () => {
        expect(highlightPipe.transform(testString, '')).toBe(testString);
        expect(highlightPipe.transform(testString, 'abc')).toBe(testString);
        expect(highlightPipe.transform(testString, '.;[]')).toBe(testString);
        expect(highlightPipe.transform(testString, '😊 👍')).toBe(testString);
    });

    it('should return original string with unexpected term', () => {
        expect(highlightPipe.transform(testString, <any>1)).toBe(testString);
        expect(highlightPipe.transform(testString, <any>undefined)).toBe(testString);
        expect(highlightPipe.transform(testString, <any>null)).toBe(testString);
        expect(highlightPipe.transform(testString, <any>false)).toBe(testString);
        expect(highlightPipe.transform(testString, <any>{})).toBe(testString);
        expect(highlightPipe.transform(testString, <any>[])).toBe(testString);
    });

    it('should handle malformed regex strings', () => {
        expect(highlightPipe.transform(testString, '[')).toBe(testString);
        expect(highlightPipe.transform(testString, '(')).toBe(testString);
        expect(highlightPipe.transform(testString, '[awdad.?(((')).toBe(testString);
        expect(highlightPipe.transform(testString, 'aw^ dd$ffe')).toBe(testString);
    });

    it('should highlight a matched word', () => {
        expect(highlightPipe.transform(testString, 'who')).toBe(
            `Those ${open}who${close} believe in telekinetics, raise my hand`
        );
        expect(highlightPipe.transform(testString, 'Those')).toBe(
            `${open}Those${close} who believe in telekinetics, raise my hand`
        );
        expect(highlightPipe.transform(testString, 'telekinetics')).toBe(
            `Those who believe in ${open}telekinetics${close}, raise my hand`
        );
        expect(highlightPipe.transform(testString, 'hand')).toBe(
            `Those who believe in telekinetics, raise my ${open}hand${close}`
        );
    });

    it('should use a case-insensitive match', () => {
        expect(highlightPipe.transform(testString, 'WHO')).toBe(
            `Those ${open}who${close} believe in telekinetics, raise my hand`
        );
        expect(highlightPipe.transform(testString, 'those')).toBe(
            `${open}Those${close} who believe in telekinetics, raise my hand`
        );
    });

    it('should highlight a matched partial word', () => {
        expect(highlightPipe.transform(testString, 'tele')).toBe(
            `Those who believe in ${open}tele${close}kinetics, raise my hand`
        );
        expect(highlightPipe.transform(testString, 'nd')).toBe(
            `Those who believe in telekinetics, raise my ha${open}nd${close}`
        );
    });

    it('should highlight multiple matches', () => {
        expect(highlightPipe.transform(testString, 'h')).toBe(
            `T${open}h${close}ose w${open}h${close}o believe in telekinetics, raise my ${open}h${close}and`
        );
    });

    it('should highlight term spanning word boundaries', () => {
        expect(highlightPipe.transform(testString, 'raise my')).toBe(
            `Those who believe in telekinetics, ${open}raise my${close} hand`
        );
        expect(highlightPipe.transform(testString, 'Those who beli')).toBe(
            `${open}Those who beli${close}eve in telekinetics, raise my hand`
        );
    });
});
