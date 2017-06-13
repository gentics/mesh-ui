import { filenameExtension, queryString } from './util';

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
});
