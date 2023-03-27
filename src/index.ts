import cropImageData, { CropOptions, ImageDataLike } from 'crop-image-data';

type ImageDataLikeData = Uint8ClampedArray | number[];

export type RGBA = [number, number, number, number];

export type TrimColorFunc = (rgba: RGBA) => boolean;

type Side = 'top' | 'right' | 'bottom' | 'left';

export interface TrimOptions {
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
  } else if (Array.isArray(option)) {
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

export default function trimImageData(
  imageData: ImageDataLike,
  trimOptions?: TrimOptions
): ImageData {
  const trimColor: TrimColorFunc = getTrimColorFunc(trimOptions?.trimColor);

  const cropOptions: CropOptions = {};
  const sides: Side[] = ['top', 'bottom', 'left', 'right'];

  for (let i = 0; i < sides.length; i++) {
    const side = sides[i];
    const crop = scanSide(imageData, side, trimColor);

    if (crop === null) {
      return getEmptyImageData();
    }

    cropOptions[side] = crop;
  }

  return cropImageData(imageData, cropOptions);
}
