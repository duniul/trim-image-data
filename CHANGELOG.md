# Changelog

## 2.1.0

### Minor Changes

- Add `getTrimEdges()` function, which returns the calculated edges of the trim without cropping the _[`#5`](https://github.com/duniul/trim-image-data/pull/5) [`a159cad2f62fa19609a0e34c8e2bb28d5159c14c`](https://github.com/duniul/trim-image-data/commit/a159cad2f62fa19609a0e34c8e2bb28d5159c14c) [@duniul](https://github.com/duniul)_

  image.

### Patch Changes

- Add typedocs to exported types and functions. _[`#5`](https://github.com/duniul/trim-image-data/pull/5) [`10439df12807acd0d5683b927e725256c45579f3`](https://github.com/duniul/trim-image-data/commit/10439df12807acd0d5683b927e725256c45579f3) [@duniul](https://github.com/duniul)_

## 2.0.1

### Patch Changes

- Bump `crop-image-data` dependency.
  _[`b5d0879`](https://github.com/duniul/trim-image-data/commit/b5d087938497908e915c22ccf76683c4a63c0058)
  [@duniul](https://github.com/duniul)_
- Support both ESM and CJS.
  _[`d4b4e68`](https://github.com/duniul/trim-image-data/commit/d4b4e688461b25ddc9326dbfe92c06760ae953d5)
  [@duniul](https://github.com/duniul)_

## 2.0.0

### Major Changes

- BREAKING CHANGE: `trimColor` now accepts an RGBA array instead of an object.

  - Before: `trimColor: ({ red, blue, green, alpha }) => { ... }`
  - Now: `trimColor: ([red, blue, green, alpha]) => { ... }`

- BREAKING CHANGE: the response of `trimColor` should now return return true if you _want_ the color
  to be trimmed, so essentially the opposite of the previous behavior.

### Minor Changes

- `trimColor` now also accepts a single RGBA-array as a shorthand for a callback that returns `true`
  if all channels are equal to the corresponding value in the array.
  - Example: `trimColor: [255, 255, 255, 255]` (would trim white pixels)

### Patch Changes

- Fix default behavior of `trimImageData()`.

## 1.0.2

### Bug Fixes

- Only include built files in the package.
