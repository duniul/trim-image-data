import IsomorphicImageData from '@canvas/image-data';
import { describe, expect, it } from 'vitest';
import { getTestImageData } from '../test/testImageData.js';
import trimImageData, { RGBA, TrimEdges, getTrimEdges } from './index.js';

global.ImageData = IsomorphicImageData as any;

type ImageDataCellLike = [number, number, number, number];

/** Transparent ImageData cell*/
const t: ImageDataCellLike = [0, 0, 0, 0];

/** White ImageData cell */
const w: ImageDataCellLike = [0, 0, 0, 255];

/** Black ImageData cell */
const b: ImageDataCellLike = [255, 255, 255, 255];

function isSameData(dataA: Uint8ClampedArray | number[], dataB: Uint8ClampedArray | number[]) {
  if (dataA.length !== dataB.length) {
    return false;
  }

  return dataA.join() === dataB.join();
}

function flat(arr: number[][]) {
  return arr.reduce((acc, val) => acc.concat(val), []);
}

describe(getTrimEdges.name, () => {
  it('returns expected trim edges', () => {
    // prettier-ignore
    const dataIn = flat([
      t, t, t, t, t, t,
      t, t, t, t, t, t,
      t, b, b, b, b, t,
      t, b, b, b, b, t,
      t, t, t, t, t, t,
      t, t, t, t, t, t,
    ]);

    const result = getTrimEdges(new ImageData(Uint8ClampedArray.from(dataIn), 6, 6));
    expect(result).toEqual({ top: 2, bottom: 2, left: 1, right: 1 });
  });

  it('returns null if the whole image should be trimmed', () => {
    // prettier-ignore
    const dataIn = flat([
      t, t, t, t,
      t, t, t, t,
      t, t, t, t,
      t, t, t, t,
    ]);

    const result = getTrimEdges(new ImageData(Uint8ClampedArray.from(dataIn), 4, 4));
    expect(result).toEqual(null);
  });
});

describe(trimImageData.name, () => {
  describe('test data arrays', () => {
    it('trims transparent pixels by default', () => {
      // prettier-ignore
      const dataIn = flat([
      t, t, t, t, t, t,
      t, t, b, b, t, t,
      t, b, b, b, b, t,
      t, b, b, b, b, t,
      t, t, b, b, t, t,
      t, t, t, t, t, t,
    ]);

      // prettier-ignore
      const expectedDataOut = flat([
      t, b, b, t,
      b, b, b, b,
      b, b, b, b,
      t, b, b, t,
    ]);

      const imageData = new ImageData(Uint8ClampedArray.from(dataIn), 6, 6);
      const result = trimImageData(imageData);

      expect(result.width).toEqual(4);
      expect(result.height).toEqual(4);
      expect(isSameData(result.data, expectedDataOut)).toBe(true);
    });

    it.each([
      {
        label: 'callback',
        trimColor: ([red, green, blue, alpha]: RGBA) =>
          red === 255 && green === 255 && blue === 255 && alpha === 255,
      },
      { label: 'shorthand', trimColor: [255, 255, 255, 255] as [number, number, number, number] },
    ])('trims custom pixels through trimColor function ($label)', ({ trimColor }) => {
      // prettier-ignore
      const dataIn = flat([
        b, b, b, b, b, b,
        b, b, w, w, b, b,
        b, w, w, w, w, b,
        b, w, w, w, w, b,
        b, b, w, w, b, b,
        b, b, b, b, b, b,
      ]);

      // prettier-ignore
      const expectedDataOut = flat([
        b, w, w, b,
        w, w, w, w,
        w, w, w, w,
        b, w, w, b,
      ]);

      const imageData = new ImageData(Uint8ClampedArray.from(dataIn), 6, 6);
      const result = trimImageData(imageData, { trimColor });

      expect(result.width).toEqual(4);
      expect(result.height).toEqual(4);
      expect(isSameData(result.data, expectedDataOut)).toBe(true);
    });

    it('does nothing if ImageData is already trimmed', () => {
      // prettier-ignore
      const dataIn = flat([
      t, b, b, t,
      b, b, b, b,
      b, b, b, b,
      t, b, b, t,
    ]);

      const imageData = new ImageData(Uint8ClampedArray.from(dataIn), 4, 4);
      const result = trimImageData(imageData);
      expect(isSameData(result.data, dataIn)).toBe(true);
    });
  });

  describe('test real images', () => {
    const images = ['mario', 'sans'];

    it.each(images)('correctly trims image: %p', async key => {
      const [untrimmedImageData, trimmedImageData] = await Promise.all([
        getTestImageData(`${key}.png`),
        getTestImageData(`${key}_trimmed.png`),
      ]);

      const result = trimImageData(untrimmedImageData);
      expect(result.width).toEqual(trimmedImageData.width);
      expect(result.height).toEqual(trimmedImageData.height);
      expect(isSameData(result.data, trimmedImageData.data)).toBe(true);
    });
  });
});
