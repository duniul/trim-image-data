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
