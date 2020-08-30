import cropImageData, { ImageDataLike } from 'crop-image-data';

interface RGBA {
  red: number;
  green: number;
  blue: number;
  alpha: number;
}

interface RGBAOptions {
  data: number[] | Uint8ClampedArray;
  width: number;
  x: number;
  y: number;
}

type TrimColorFunc = (rgba: RGBA) => boolean;

interface ScanOptions {
  trimColor: TrimColorFunc;
  reverse: boolean;
}

interface TrimOptions {
  trimColor: TrimColorFunc;
}

function getRGBA({ data, width, x, y }: RGBAOptions): RGBA {
  const index = (width * y + x) * 4;
  return {
    red: data[index],
    green: data[index + 1],
    blue: data[index + 2],
    alpha: data[index + 3],
  };
}

function scanY(imageData: ImageDataLike, { trimColor, reverse }: ScanOptions): number | null {
  const { data, width, height } = imageData;
  const offset = reverse ? -1 : 1;
  const firstCol = reverse ? height - 1 : 0;

  // loop through each row
  for (let y = firstCol; reverse ? y > -1 : y < height; y += offset) {
    // loop through each column
    for (let x = 0; x < width; x++) {
      const rgba = getRGBA({ data, width, x, y });
      if (trimColor(rgba)) {
        // return number of rows from edge
        return reverse ? firstCol - y : y;
      }
    }
  }

  // the whole image should be trimmed
  return null;
}

// finds the first x coord in imgData that is not white
function scanX(imageData: ImageDataLike, { trimColor, reverse }: ScanOptions): number | null {
  const { data, width, height } = imageData;
  const offset = reverse ? -1 : 1;
  const firstRow = reverse ? width - 1 : 0;

  // loop through each column
  for (let x = firstRow; reverse ? x > -1 : x < width; x += offset) {
    // loop through each row
    for (let y = 0; y < height; y++) {
      const rgba = getRGBA({ data, width, x, y });
      if (trimColor(rgba)) {
        // return number of columns from edge
        return reverse ? firstRow - x : x;
      }
    }
  }

  // the whole image should be trimmed
  return null;
}

function getEmptyImageData() {
  return new ImageData(1, 1);
}

export default function trimImageData(imageData: ImageDataLike, trimOptions?: TrimOptions) {
  const trimColor: TrimColorFunc = trimOptions?.trimColor || (({ alpha }) => !!alpha);

  const top = scanY(imageData, { reverse: false, trimColor });
  if (top === null) {
    return getEmptyImageData();
  }

  const right = scanX(imageData, { reverse: true, trimColor });
  if (right === null) {
    return getEmptyImageData();
  }

  const bottom = scanY(imageData, { reverse: false, trimColor });
  if (bottom === null) {
    return getEmptyImageData();
  }

  const left = scanX(imageData, { reverse: true, trimColor });
  if (left === null) {
    return getEmptyImageData();
  }

  return cropImageData(imageData, { top, right, bottom, left });
}
