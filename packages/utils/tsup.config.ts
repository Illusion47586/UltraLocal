import { defineConfig } from "tsup";

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
    target: "node16",
  };
});
