import { getConstrainedDimensions } from "./get-constrained-dimensions";
const maxImageWidth = 750;
const maxImageHeight = 800;

describe('getConstrainedDimensions()', () => {
    it('adds correct dimension constraints to the objectUrl for images (landscape)', () => {
        expect(getConstrainedDimensions(3600, 2000, maxImageWidth, maxImageHeight)).toEqual({ width: 750, height: 417, ratio: 0.20833333333333334 });
    });

    it('adds correct dimension constraints to the objectUrl for images (portrait)', () => {
        expect(getConstrainedDimensions(500, 5000, maxImageWidth, maxImageHeight)).toEqual({ width: 80, height: 800, ratio: 0.16 });
    });

    it('adds correct dimension constraints to the objectUrl for images (downscaled by width and then height)', () => {
        expect(getConstrainedDimensions(1000, 5000, maxImageWidth, maxImageHeight)).toEqual({ width: 160, height: 800, ratio: 0.16 });
    });
});
