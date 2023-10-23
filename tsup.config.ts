import { defineConfig } from 'tsup';

export default defineConfig({
  format: ['esm', 'cjs'],
  entry: ['src/index.ts'],
  platform: 'node',
  target: 'node16',
  clean: true,
  dts: true,
});
