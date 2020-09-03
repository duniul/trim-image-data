import ImageData from '@canvas/image-data';
import trimImageData from '.';
import { getTestImageData } from '../test/testImageData';

global.ImageData = ImageData;

function isSameData(dataA: Uint8ClampedArray | number[], dataB: Uint8ClampedArray | number[]) {
  if (dataA.length !== dataB.length) {
    return false;
  }

  return dataA.join() === dataB.join();
}

describe('test data arrays', () => {
  const t = [0, 0, 0, 0]; // transparent
  const w = [0, 0, 0, 255]; // white
  const b = [255, 255, 255, 255]; // black

  function flat(arr: number[][]) {
    return arr.reduce((acc, val) => acc.concat(val), []);
  }

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

  it('trims custom pixels through trimColor function', () => {
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
    const result = trimImageData(imageData, {
      trimColor: ({ red, green, blue, alpha }) =>
        red === 0 && green === 0 && blue === 0 && alpha === 255,
    });

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
