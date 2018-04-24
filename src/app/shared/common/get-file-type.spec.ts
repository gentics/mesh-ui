import { getFileType } from "./get-file-type";

describe('getFileType()', () => {
    it('returns type "image"', () => {
        expect(getFileType('image/jpeg')).toEqual('image');
        expect(getFileType('ImaGe/jpeg')).toEqual('image');
        expect(getFileType('ImaGe/video/audio')).toEqual('image');
    });

    it('returns type "video"', () => {
        expect(getFileType('video/ogg')).toEqual('video');
    });

    it('returns type "application"', () => {
        expect(getFileType('application/pdf')).toEqual('application');
    });
});
