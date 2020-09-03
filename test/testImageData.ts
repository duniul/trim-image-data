/* eslint-disable @typescript-eslint/explicit-module-boundary-types */

import ImageData from '@canvas/image-data';
import path from 'path';
import sharp from 'sharp';

export async function getTestImageData(imageName: string) {
  const src = path.resolve(__dirname, 'images', imageName);
  const image = await sharp(src).raw().ensureAlpha().toBuffer({ resolveWithObject: true });

  const dataLength = image.data.length;
  const correctedData: number[] = [];

  for (let i = 0; i < dataLength; i += 4) {
    const alpha = image.data[i + 3];
    if (alpha === 0) {
      correctedData.push(0, 0, 0, 0);
    } else {
      correctedData.push(image.data[i], image.data[i + 1], image.data[i + 2], alpha);
    }
  }

  return new ImageData(new Uint8ClampedArray(correctedData), image.info.width, image.info.height);
}
