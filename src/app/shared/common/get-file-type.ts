/**
 * Returns a 'type' part of the mimeType header
 * image/jpeg => image
 * video/ogg => video
 */
export function getFileType(mimeType: string): 'image' | 'video' | 'audio' | string | null {
    if (!mimeType) {
        return null;
    }
    return (mimeType.split('/')[0] as string).toLowerCase();
}
