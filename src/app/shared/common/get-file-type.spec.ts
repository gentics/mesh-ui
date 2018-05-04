import { getFileType } from "./get-file-type";

describe('getFileType()', () => {
    it('returns type "image"', () => {
        expect(getFileType('image/jpeg', 'image.jpg')).toEqual('image');
        expect(getFileType('ImaGe/jpeg', 'image.JpG' )).toEqual('image');
        expect(getFileType('ImaGe/video/audio', 'image.gif')).toEqual('image');
    });

    it('returns type "video"', () => {
        expect(getFileType('video/ogg', 'video.ogg')).toEqual('video');
    });

    it('returns extension', () => {
        expect(getFileType('application/pdf', 'app.pdf')).toEqual('.pdf');
    });

    it('returns extension for an unknown file', () => {
        expect(getFileType('application/mac-binhex40', 'app.hqx')).toEqual('.hqx');
    });

    it('should not fail if mime type contains no slash', () => {
        expect(getFileType('video', 'video.ogg')).toEqual('video');
        expect(getFileType('blabla', 'whatever')).toEqual('whatever');
        expect(getFileType('blabla', 'whatever.ext')).toEqual('.ext');
        expect(() => getFileType('video', 'video.ogg')).not.toThrow();
    });
});
