import { defineConfig } from 'vite';
import dts from 'vite-plugin-dts'

export default defineConfig({
  esbuild: {
    supported: {
      'top-level-await': true
    },
  },
  build: {
    lib:{
      entry: "src/index.ts",
      name: "sam-lib",
      formats: ["es"],
      fileName: "index",
    }
  },
  plugins: [dts()]
});
