module.exports = {
  root: true,
  parser: "@typescript-eslint/parser",
  plugins: ["@typescript-eslint", "jsx-a11y"],
  extends: [
    "eslint:recommended",
    "plugin:@typescript-eslint/recommended",
    "plugin:jsx-a11y/recommended"
  ],
  env: { browser: true, es2022: true, node: true },
  ignorePatterns: ["dist", "node_modules", "tsc-out", "packages/ui/src/icons/generated", "storybook-static", "apps"]
};
