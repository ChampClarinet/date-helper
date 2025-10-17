import js from "@eslint/js";
import reactHooks from "eslint-plugin-react-hooks";
import globals from "globals";
import tseslint from "typescript-eslint";

/**
 * Modern ESLint flat config for TypeScript + React Hooks
 * Compatible with ESLint v9 and typescript-eslint v8+
 * Supports React 18 & 19
 */
export default [
  // Ignore patterns
  { ignores: ["dist", "node_modules"] },

  // Base JS rules
  js.configs.recommended,

  // TypeScript recommended rules
  ...tseslint.configs.recommended,

  {
    files: ["**/*.{ts,tsx,js,jsx}"],
    languageOptions: {
      ecmaVersion: 2022,
      sourceType: "module",
      globals: globals.browser,
    },
    plugins: {
      "react-hooks": reactHooks,
    },
    rules: {
      // React Hooks best practices
      ...reactHooks.configs.recommended.rules,

      // TypeScript rules
      "@typescript-eslint/consistent-type-imports": "error",
      "@typescript-eslint/no-unused-vars": [
        "warn",
        { argsIgnorePattern: "^_", varsIgnorePattern: "^_" },
      ],

      // General JS rules
      "no-console": ["error", { allow: ["warn", "error", "info"] }],
      "no-unused-vars": "off", // ปิดของ JS ให้ใช้ของ TS แทน
    },
  },
];
