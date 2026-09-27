import tsParser from "@typescript-eslint/parser";
import { eolasLintPreset } from "./packages/eolas-ui/lint/index.js";

export default [
  {
    files: ["**/*.{ts,tsx,js,jsx}"],
    languageOptions: {
      parser: tsParser,
      parserOptions: {
        ecmaVersion: "latest",
        sourceType: "module",
        ecmaFeatures: {
          jsx: true,
        },
      },
    },
  },
  ...eolasLintPreset,
  {
    ignores: [
      "dist/**",
      "public/**",
      "node_modules/**",
      "scratch/**",
      ".agents/**",
      "packages/eolas-ui/registry/**",
    ],
  },
];
