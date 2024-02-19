# trim-image-data

[![](https://img.shields.io/npm/v/trim-image-data?color=brightgreen)](https://www.npmjs.com/package/trim-image-data)
[![](https://img.shields.io/bundlephobia/minzip/trim-image-data)](https://bundlephobia.com/result?p=trim-image-data)

💇‍♀️ Function for trimming/cropping transparent pixels surrounding an image. Very similar to
[trim-canvas], but accepts and returns an [ImageData][image-data]-instance instead. Also allows
specifying custom colors to trim.

## Demo

https://trim-image-data.netlify.app

## Usage

```js
import trimImageData from 'trim-image-data';

// trim surrounding fully transparent pixels
const trimmedTransparent = trimImageData(imageData);

// trim surrounding white pixels
const trimmedWhite = trimImageData(imageData, {
  trimColor: ([red, green, blue, alpha]) => {
    return red === 255 && green === 255 && blue === 255 && alpha === 255;
  };
});

// supports passing a RGBA array instead of a callback too
const trimmedWhite = trimImageData(imageData, {
  trimColor: [255, 255, 255, 255]
});

// trim any pixel with max alpha
const trimmedDim = trimImageData(imageData, {
  trimColor: ([alpha]) => alpha === 255
});
```

## Installation

```sh
# npm
npm install trim-image-data

# yarn
yarn add trim-image-data

# pnpm
pnpm add trim-image-data
```

## API

### `trimImageData(imageData, trimOptions)`

Creates a trimmed version of an ImageData-instance. Trims fully transparent pixels by default. Does
not mutate the recieved instance.

**Parameters:**

- `imageData` - the ImageData-instance to crop

- `trimOptions` - optional

  - `trimColor([red, green, blue, alpha]) => boolean` | `trimColor: [r, g, b, a]`  
    Callback function used to determine if a value should be trimmed or not. Receives an object of
    RGBA channels and should return a boolean.

    Also accepts a single RGBA-array as a shorthand for a callback that returns `true` if all
    channels are equal to the corresponding channel in the array.

**Return value:**

A new, trimmed ImageData-instance.

### `getTrimEdges(imageData, trimOptions)`

Calculates the number of pixels to trim from each side of an image, provided as an ImageData object.
Does not actually trim the image.

Uses the same options and defaults as `trimImageData`.

**Parameters:**

- `imageData` - the ImageData-instance to calculate the trim for

- `trimOptions` - optional

  - `trimColor([red, green, blue, alpha]) => boolean` | `trimColor: [r, g, b, a]`  
    Callback function used to determine if a value should be trimmed or not. Receives an object of
    RGBA channels and should return a boolean.

    Also accepts a single RGBA-array as a shorthand for a callback that returns `true` if all
    channels are equal to the corresponding channel in the array.

**Return value:**

A new, trimmed ImageData-instance.

## Related packages

- [crop-image-data] - crops ImageData by specified number of pixels. Used as a dependency in
  `trim-image-data`.

## Credits

A lot of the code in this repo is based on [trim-canvas], I just had a need for the same
functionality without passing a canvas.

[trim-canvas]: https://github.com/agilgur5/trim-canvas
[image-data]: https://developer.mozilla.org/en-US/docs/Web/API/ImageData
[crop-image-data]: https://github.com/duniul/crop-image-data
