import { FileSizePipe } from './file-size.pipe';

describe('FileSizePipe:', () => {

    let fileSizePipe: FileSizePipe;
    beforeEach(() => fileSizePipe = new FileSizePipe());

    it('should handle bytes', () => {
        expect(fileSizePipe.transform(123)).toBe('123 B');
    });

    it('should handle kilobytes', () => {
        expect(fileSizePipe.transform(12340)).toBe('12.3 kB');
    });

    it('should handle megabytes', () => {
        expect(fileSizePipe.transform(1234500)).toBe('1.2 MB');
    });

    it('should handle gigabytes', () => {
        expect(fileSizePipe.transform(1234500000)).toBe('1.2 GB');
    });

    it('should handle kibibytes', () => {
        expect(fileSizePipe.transform(12340, false)).toBe('12.1 KiB');
    });

    it('should handle mebibytes', () => {
        expect(fileSizePipe.transform(13434500, false)).toBe('12.8 MiB');
    });

    describe('exceptional input', () => {

        it('should handle a string', () => {
            expect(fileSizePipe.transform((<any> '1230'))).toBe('1.2 kB');
        });

        it('should handle null', () => {
            expect(fileSizePipe.transform((<any> null))).toBeNull();
        });

        it('should handle undefined', () => {
            expect(fileSizePipe.transform((<any> undefined))).toBeUndefined();
        });

        it('should handle an object', () => {
            let obj = {};
            expect(fileSizePipe.transform((<any> obj))).toBe(obj);
        });

        it('should handle a function', () => {
            let fn = () => {};
            expect(fileSizePipe.transform((<any> fn))).toBe(fn);
        });
    });
});
