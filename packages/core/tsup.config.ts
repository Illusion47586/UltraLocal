import { defineConfig } from "tsup";
import eslint from "esbuild-plugin-eslint";

export default defineConfig((options) => {
  return {
    splitting: true,
    clean: true,
    dts: true,
    entry: ["./src/index.ts"],
    format: ["esm"],
    minify: false,
    sourcemap: !options.watch,
    treeshake: true,
    esbuildPlugins: [
      eslint({
        useEslintrc: true,
        fix: true,
        filter: /\.(jsx?|tsx?|d.ts|ts|js|cjs|mjs)$/,
      }),
    ],
    target: "node16",
  };
});
