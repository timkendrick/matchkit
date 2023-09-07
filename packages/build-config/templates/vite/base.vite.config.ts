import { defineConfig } from 'vite';
import dts from 'vite-plugin-dts';

export default defineConfig({
  plugins: [
    dts({
      exclude: ['node_modules/**', '*.config.ts', '**/*.test.ts'],
    }),
  ],
});
