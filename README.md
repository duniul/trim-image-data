# trim-image-data

[![](https://img.shields.io/npm/v/trim-image-data?color=brightgreen)](https://www.npmjs.com/package/trim-image-data)
[![](https://img.shields.io/bundlephobia/minzip/trim-image-data)](https://bundlephobia.com/result?p=trim-image-data)

💇‍♀️ Function for trimming/cropping transparent pixels surrounding an image. Very similar to
[trim-canvas], but accepts and returns an [ImageData][image-data]-instance instead. Also allows
specifying custom colors to trim.

## Demo

https://trim-image-data.netlify.app

## Installation

| npm                           | yarn                        |
| ----------------------------- | --------------------------- |
| `npm install trim-image-data` | `yarn add trim-image-data`  |

## Usage

### `trimImageData(imageData, trimOptions)`

Creates a trimmed version of an ImageData-instance. Trims fully transparent pixels by default. Does
not mutate the recieved instance.

**Parameters:**

- `imageData` - the ImageData-instance instance to crop

- `cropOptions` - optional, an object specifying the amount of pixels to crop from each side
  - `trimColor({ red, green, blue, alpha }) => boolean`  
    Callback function used to determine if a value should be trimmed or not. Receives an object of
    RGBA channels and should return a boolean.

**Return value:**

A new, trimmed ImageData-instance.

**Examples:**

```js
import trimImageData from 'trim-image-data';

// trim surrounding fully transparent pixels
const trimmedTransparent = trimImageData(imageData);

// trim surrounding white pixels
const trimmedWhite = trimImageData(imageData, {
  trimColor: ({ red, green, blue, alpha }) => {
    return red === 255 && green === 255 && blue === 255 && alpha === 255;
  };
});

// trim any pixel without max alpha
const trimmedDim = trimImageData(imageData, {
  trimColor: ({ alpha }) => alpha === 255
});
```

## Related packages

- [crop-image-data] - crops ImageData by specified number of pixels. Used as a dependency in
  `trim-image-data`.

## Credits

A lot of the code in this repo is based on [trim-canvas], I just had a need for the same
functionality without passing a canvas.

[trim-canvas]: https://github.com/agilgur5/trim-canvas
[image-data]: https://developer.mozilla.org/en-US/docs/Web/API/ImageData
[crop-image-data]: https://github.com/duniul/crop-image-data
