// eslint.config.mjs
//$ npm install --save-dev --force @eslint/js eslint-config-prettier eslint-plugin-react-hooks eslint-plugin-react-refresh typescript-eslint

import js from "@eslint/js";
import prettier from "eslint-config-prettier";
import reactHooks from "eslint-plugin-react-hooks";
import reactRefresh from "eslint-plugin-react-refresh";
import globals from "globals";
import tseslint from "typescript-eslint";

/**
 * @see https://eslint.org/docs/latest/use/configure/configuration-files
 * @type {import("tseslint").config}
 */
export default tseslint.config(
  { ignores: ["dist", "**/*.test.ts*"] },
  {
    extends: [
      ...tseslint.configs.recommended,
      js.configs.recommended,
      prettier, // must be last
    ],
    files: ["**/*.{ts,tsx}"],
    // languageOptions: { ecmaVersion: "latest", globals: globals.browser },
    plugins: { "react-hooks": reactHooks, "react-refresh": reactRefresh },
    rules: {
      ...reactHooks.configs.recommended.rules,
      "react-refresh/only-export-components": [
        "error",
        { allowConstantExport: true },
      ],
      eqeqeq: ["error", "always"],
      "no-console": ["error", { allow: ["warn", "error"] }],
      "no-unused-vars": [
        "error",
        { argsIgnorePattern: "^_", varsIgnorePattern: "^_" },
      ],
      // '@typescript-eslint/no-unused-locals': 'error',
      // '@typescript-eslint/no-unused-parameters': 'error',
    },
  }
);
