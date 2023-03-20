/**
 * @type {import('eslint').Linter.Config}
 */
module.exports = {
  root: true,
  env: {
    browser: true,
    es2021: true,
    node: true,
  },
  plugins: ["import", "react"],
  extends: ["custom"],
  settings: {
    "import/resolver": {
      node: {
        extensions: [".js", ".jsx", ".ts", ".tsx", ".d.ts"],
        project: ["./tsconfig.json"],
      },
      webpack: {},
      typescript: {
        project: ["./tsconfig.json"],
      },
    },
  },
};
