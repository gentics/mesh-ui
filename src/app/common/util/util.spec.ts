import { filenameExtension, queryString, simpleDeepEquals } from './util';

describe('Utility', () => {
    describe('Filename extension', () => {
        it('returns the extension with the dot', () => {
            expect(filenameExtension('file.jpg')).toBe('.jpg');
        });

        it('returns the last part if there is more then one dot', () => {
            expect(filenameExtension('util.spec.ts')).toBe('.ts');
        });

        it('returns an empty string if there is no dot', () => {
            expect(filenameExtension('util')).toBe('');
        });

        it('returns an empty string on an empty string', () => {
            expect(filenameExtension('')).toBe('');
        });
    });

    describe('query string', () => {
        it('returns the query string with ?', () => {
            const query = {
                a: 1,
                b: '2',
                c: '3'
            };
            expect(queryString(query)).toBe('?a=1&b=2&c=3');
        });

        it('returns an empty string if all entries are undefined or null', () => {
            const query = {
                a: undefined,
                b: null,
            };
            expect(queryString(query)).toBe('');
        });

        it('returns an empty string on empty object', () => {
            const query = {
            };
            expect(queryString(query)).toBe('');
        });
    });

    describe('simpleDeepEquals()', () => {

        it('works with primitive values', () => {
            expect(simpleDeepEquals(1, 1)).toBe(true, '1, 1');
            expect(simpleDeepEquals(1, 2)).toBe(false, '1, 2');
            expect(simpleDeepEquals('foo', 'foo')).toBe(true, '"foo", "foo"');
            expect(simpleDeepEquals('foo', 'bar')).toBe(false, '"foo", "bar"');
            expect(simpleDeepEquals(true, true)).toBe(true, 'true, true');
            expect(simpleDeepEquals(true, false)).toBe(false, 'true, false');
        });

        it('works with 1 level deep objects', () => {
            expect(simpleDeepEquals({ foo: 1}, { foo: 1})).toBe(true);
            expect(simpleDeepEquals({ foo: 1, bar: 2}, { foo: 1, bar: 2})).toBe(true);
            expect(simpleDeepEquals({ foo: 1, bar: 2}, { foo: 1, bar: 3})).toBe(false);
        });

        it('works with arrays of primitives', () => {
            expect(simpleDeepEquals([1, 2, 3], [1, 2, 3])).toBe(true);
            expect(simpleDeepEquals([1, 2, 3], [1, 1, 3])).toBe(false);
        });

        it('works with 2 level deep objects', () => {
            expect(simpleDeepEquals({ foo: { bar: true } }, { foo: { bar: true } })).toBe(true);
            expect(simpleDeepEquals({ foo: { bar: true } }, { foo: { bar: false } })).toBe(false);
        });

        it('works with arrays of objects', () => {
            expect(simpleDeepEquals([{ foo: { bar: [1, 2] } }, true], [{ foo: { bar: [1, 2] } }, true])).toBe(true);
            expect(simpleDeepEquals([{ foo: { bar: [1, 2] } }, true], [{ foo: { bar: [1, 2] } }, false])).toBe(false);
            expect(simpleDeepEquals([{ foo: { bar: [1, 2] } }, true], [{ foo: { bar: [1, 5] } }, true])).toBe(false);
            expect(simpleDeepEquals([{ foo: { bar: [1, 2] } }, true], [{ foo: { bar: [1, 2, 3] } }, true])).toBe(false);
        });

    });
});
