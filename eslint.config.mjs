import { FlatCompat } from "@eslint/eslintrc";

const compat = new FlatCompat({
  baseDirectory: process.cwd(),
  recommendedConfig: FlatCompat.recommendedConfig,
  allConfig: FlatCompat.allConfig,
  warnInsteadOfErrorOnDeprecatedRules: true,
});

export default [
  ...compat.extends("next/core-web-vitals"),
  {
    rules: {
      "@typescript-eslint/no-unused-vars": "off",
      "react/no-unescaped-entities": "off",
      "@typescript-eslint/no-explicit-any": "off" // Allow any type for params
    },
  },
];
