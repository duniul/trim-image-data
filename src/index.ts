import cropImageData, { CropOptions, ImageDataLike } from 'crop-image-data';

type ImageDataLikeData = Uint8ClampedArray | number[];
type Side = 'top' | 'right' | 'bottom' | 'left';

/**
 * RGBA color representation as an array of 4 numbers: red, green, blue, alpha.
 */
export type RGBA = [number, number, number, number];

/**
 * Function that returns `true` if the pixel should be trimmed, `false` otherwise.
 *
 * @example
 * const trimOpaque: TrimColorFunc = ([r, g, b, a]) => a === 255;
 * const trimWhite: TrimColorFunc = ([r, g, b, a]) => r === 255 && g === 255 && b === 255;
 * const trimAnyRedChannel: TrimColorFunc = ([r, g, b, a]) => r > 0;
 */
export type TrimColorFunc = (rgba: RGBA) => boolean;

/**
 * Object representing the number of pixels to trim from each side of an image.
 */
export type TrimEdges = Required<CropOptions>;

/**
 * Options to configure the trim operation.
 */
export interface TrimOptions {
  /**
   * Color to trim from the edges of the image. Can be specified as an RGBA array or a function that returns `true` if the pixel should be trimmed.
   */
  trimColor: TrimColorFunc | RGBA;
}

function getEmptyImageData() {
  return new ImageData(1, 1);
}

function getRgba(data: ImageDataLikeData, i: number): RGBA {
  return [data[i], data[i + 1], data[i + 2], data[i + 3]];
}

function getTrimColorFunc(option: TrimOptions['trimColor'] | undefined): TrimColorFunc {
  if (typeof option === 'function') {
    return option;
  }

  if (Array.isArray(option)) {
    return ([r, g, b, a]) => {
      return r === option[0] && g === option[1] && b === option[2] && a === option[3];
    };
  }

  // trim transparent pixels by default
  return rgba => rgba[3] === 0;
}

function scanSide(imageData: ImageDataLike, side: Side, trimColor: TrimColorFunc) {
  const { data, width, height } = imageData;
  const horizontal = side === 'left' || side === 'right';
  const reverse = side === 'right' || side === 'bottom';
  const primaryAxis = horizontal ? width : height;
  const secondaryAxis = horizontal ? height : width;
  const step = reverse ? -1 : 1;
  const start = reverse ? primaryAxis - 1 : 0;

  // loop through each column
  for (let p = start; reverse ? p > -1 : p < primaryAxis; p += step) {
    // loop through each row
    for (let s = 0; s < secondaryAxis; s++) {
      const index = (horizontal ? width * s + p : width * p + s) * 4;
      const rgba = getRgba(data, index);
      if (!trimColor(rgba)) {
        // return number of columns from edge
        return reverse ? start - p : p;
      }
    }
  }

  // the whole image should be trimmed
  return null;
}

/**
 * Calculates the number of pixels to trim from each side of an image, provided as an ImageData object.
 * Does not actually trim the image.
 *
 * @param imageData `ImageData` of the image to calculate the trim for
 * @param trimOptions Options to configure the trim operation
 * @returns the number of pixels to trim from each side of the image
 */
export function getTrimEdges(
  imageData: ImageDataLike,
  trimOptions?: TrimOptions
): TrimEdges | null {
  const trimColor: TrimColorFunc = getTrimColorFunc(trimOptions?.trimColor);

  const trimEdges: Partial<TrimEdges> = {};
  const sides: Side[] = ['top', 'bottom', 'left', 'right'];

  for (let i = 0; i < sides.length; i++) {
    const side = sides[i];
    const crop = scanSide(imageData, side, trimColor);

    if (crop === null) {
      return null;
    }

    trimEdges[side] = crop;
  }

  return trimEdges as TrimEdges;
}

/**
 * Trims pixels from the edges of an image, provided as an ImageData object. Trims transparent pixels by default,
 * but can be configured to trim any color using the `trimOptions` parameter.
 *
 * @param imageData `ImageData` of the image to trim
 * @param trimOptions Options to configure the trim operation
 * @returns a new, trimmed `ImageData` object
 */
export function trimImageData(imageData: ImageDataLike, trimOptions?: TrimOptions): ImageData {
  const trimEdges = getTrimEdges(imageData, trimOptions);

  if (trimEdges === null) {
    return getEmptyImageData();
  }

  return cropImageData(imageData, trimEdges);
}

export default trimImageData;
