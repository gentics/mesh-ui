import {TestBed} from '@angular/core/testing';
import {HighlightPipe} from './highlight.pipe';

describe('HighlightPipe:', () => {

    const open = '<span class="hl-pipe">';
    const close = '</span>';
    let highlightPipe: HighlightPipe;
    const testString = 'Those who believe in telekinetics, raise my hand';

    /**
     * Since the pipe returns a SafeHtml value, we need to manually unwrap this in order to
     * test it.
     */
    function transformAndUnwrap(testString: string, term: string): string {
        const safeHtml: any = highlightPipe.transform(testString, term);
        return safeHtml.changingThisBreaksApplicationSecurity;
    }

    beforeEach(() => {
        TestBed.configureTestingModule({
           providers: [HighlightPipe]
        });
        highlightPipe = TestBed.get(HighlightPipe);
    });

    it('should return original string when no matches', () => {
        expect(transformAndUnwrap(testString, '')).toBe(testString);
        expect(transformAndUnwrap(testString, 'abc')).toBe(testString);
        expect(transformAndUnwrap(testString, '.;[]')).toBe(testString);
        expect(transformAndUnwrap(testString, '😊 👍')).toBe(testString);
    });

    it('should return original string with unexpected term', () => {
        expect(transformAndUnwrap(testString, <any> 1)).toBe(testString);
        expect(transformAndUnwrap(testString, <any> undefined)).toBe(testString);
        expect(transformAndUnwrap(testString, <any> null)).toBe(testString);
        expect(transformAndUnwrap(testString, <any> false)).toBe(testString);
        expect(transformAndUnwrap(testString, <any> {})).toBe(testString);
        expect(transformAndUnwrap(testString, <any> [])).toBe(testString);
    });

    it('should handle malformed regex strings', () => {
        expect(transformAndUnwrap(testString, '[')).toBe(testString);
        expect(transformAndUnwrap(testString, '(')).toBe(testString);
        expect(transformAndUnwrap(testString, '[awdad.?(((')).toBe(testString);
        expect(transformAndUnwrap(testString, 'aw^ dd$ffe')).toBe(testString);
    });

    it('should highlight a matched word', () => {
        expect(transformAndUnwrap(testString, 'who')).toBe(`Those ${open}who${close} believe in telekinetics, raise my hand`);
        expect(transformAndUnwrap(testString, 'Those')).toBe(`${open}Those${close} who believe in telekinetics, raise my hand`);
        expect(transformAndUnwrap(testString, 'telekinetics')).toBe(`Those who believe in ${open}telekinetics${close}, raise my hand`);
        expect(transformAndUnwrap(testString, 'hand')).toBe(`Those who believe in telekinetics, raise my ${open}hand${close}`);
    });

    it('should use a case-insensitive match', () => {
        expect(transformAndUnwrap(testString, 'WHO')).toBe(`Those ${open}who${close} believe in telekinetics, raise my hand`);
        expect(transformAndUnwrap(testString, 'those')).toBe(`${open}Those${close} who believe in telekinetics, raise my hand`);
    });

    it('should highlight a matched partial word', () => {
        expect(transformAndUnwrap(testString, 'tele')).toBe(`Those who believe in ${open}tele${close}kinetics, raise my hand`);
        expect(transformAndUnwrap(testString, 'nd')).toBe(`Those who believe in telekinetics, raise my ha${open}nd${close}`);
    });

    it('should highlight multiple matches', () => {
        expect(transformAndUnwrap(testString, 'h'))
            .toBe(`T${open}h${close}ose w${open}h${close}o believe in telekinetics, raise my ${open}h${close}and`);
    });

    it('should highlight term spanning word boundaries', () => {
        expect(transformAndUnwrap(testString, 'raise my')).toBe(`Those who believe in telekinetics, ${open}raise my${close} hand`);
        expect(transformAndUnwrap(testString, 'Those who beli')).toBe(`${open}Those who beli${close}eve in telekinetics, raise my hand`);
    });
});
