/**
 * Returns the constrained 2D dimensions.
 * Also returns the ratio by which the natural dimensions have been scaled down.
 */

export function getConstrainedDimensions(width: number, height: number, maxWidth: number, maxHeight: number ): { width: number; height: number; ratio: number; } {
    let ratio = 1;

    if (maxWidth < width) {
        ratio = maxWidth / width;
    }

    if (maxHeight < height) {
        ratio = Math.min(maxHeight / height, ratio);
    }

    return { width: Math.round(ratio * width), height: Math.round(ratio * height), ratio };
}
