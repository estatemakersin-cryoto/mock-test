// eslint.config.mjs
import nextPlugin from "@next/eslint-plugin-next";
import eslint from "@eslint/js";

export default [
  eslint.configs.recommended,
  {
    plugins: {
      "@next/next": nextPlugin
    },
    extends: [
      "next",
      "next/core-web-vitals"
    ],
    rules: {
      // Add custom rules if needed
    }
  }
];
