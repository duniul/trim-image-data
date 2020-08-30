import ImageData from '@canvas/image-data';
import trimImageData from '.';

global.ImageData = ImageData;

const t = [0, 0, 0, 0]; // transparent
const w = [0, 0, 0, 255]; // white
const b = [255, 255, 255, 255]; // black

it('trims transparent pixels by default', () => {
  // prettier-ignore
  const dataIn = [
    t, t, t, t, t, t,
    t, t, b, b, t, t,
    t, b, b, b, b, t,
    t, b, b, b, b, t,
    t, t, b, b, t, t,
    t, t, t, t, t, t,
  ].flat();

  // prettier-ignore
  const expectedDataOut = [
    t, b, b, t,
    b, b, b, b,
    b, b, b, b,
    t, b, b, t,
  ].flat();

  const imageData = new ImageData(Uint8ClampedArray.from(dataIn), 6, 6);
  const result = trimImageData(imageData);

  expect(result.data).toEqual(Uint8ClampedArray.from(expectedDataOut));
  expect(result.width).toEqual(4);
  expect(result.height).toEqual(4);
});

it('trims custom pixels through trimColor function', () => {
  // prettier-ignore
  const dataIn = [
    b, b, b, b, b, b,
    b, b, w, w, b, b,
    b, w, w, w, w, b,
    b, w, w, w, w, b,
    b, b, w, w, b, b,
    b, b, b, b, b, b,
  ].flat();

  // prettier-ignore
  const expectedDataOut = [
    b, w, w, b,
    w, w, w, w,
    w, w, w, w,
    b, w, w, b,
  ].flat();

  const imageData = new ImageData(Uint8ClampedArray.from(dataIn), 6, 6);
  const result = trimImageData(imageData, {
    trimColor: ({ red, green, blue, alpha }) =>
      red === 0 && green === 0 && blue === 0 && alpha === 255,
  });

  expect(result.data).toEqual(Uint8ClampedArray.from(expectedDataOut));
  expect(result.width).toEqual(4);
  expect(result.height).toEqual(4);
});

it('does nothing if ImageData is already trimmed', () => {
  // prettier-ignore
  const dataIn = [
    t, b, b, t,
    b, b, b, b,
    b, b, b, b,
    t, b, b, t,
  ].flat();

  const imageData = new ImageData(Uint8ClampedArray.from(dataIn), 4, 4);
  expect(trimImageData(imageData)).toEqual(imageData);
});
