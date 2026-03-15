import jseslint from "@eslint/js";
import stylistic from "@stylistic/eslint-plugin";
import { defineConfig, globalIgnores } from "eslint/config";
import pluginImport from "eslint-plugin-import";
import pluginSimpleImportSort from "eslint-plugin-simple-import-sort";
import globals from "globals";
import tseslint from "typescript-eslint";

export default defineConfig([
  globalIgnores([
    "node_modules",
    ".next",
    "out",
    "scripts",
    "build",
    "public",
    "dist",
    "**/*.{mjs,cjs}",
    "eslint.config.ts",
  ]),

  // Общие правила для JS/TS файлов
  {
    files: ["**/*.{js,ts}"],
    languageOptions: {
      globals: globals.browser,
    },
  },

  // Основные правила для JS/TS файлов
  {
    files: ["**/*.{js,ts}"],
    plugins: {
      js: jseslint,
    },
    extends: [jseslint.configs.recommended],
    rules: {
      "max-classes-per-file": ["warn", { max: 1 }],
      "max-depth": ["warn", { max: 4 }],
      "max-nested-callbacks": ["warn", { max: 2 }],
      "max-lines": ["warn", { max: 1000 }],
      "no-negated-condition": ["warn"],
      "no-nested-ternary": ["warn"],
      "no-shadow": ["warn"],
      "no-useless-return": ["warn"],
    },
  },

  // Дополнительные правила для TS файлов
  {
    files: ["**/*.ts"],
    plugins: {
      "@typescript-eslint": tseslint.plugin,
    },
    languageOptions: {
      parser: tseslint.parser,
      parserOptions: {
        projectService: true,
      },
    },
    extends: [tseslint.configs.recommended],
    rules: {
      "@typescript-eslint/no-explicit-any": ["off"],
      "@typescript-eslint/ban-ts-comment": ["warn"],
      "@typescript-eslint/no-empty-object-type": ["off"],
    },
  },

  // Правила для стилистики JS/TS файлов
  {
    files: ["**/*.{js,ts}"],
    plugins: {
      "@stylistic": stylistic,
    },
    rules: {
      "@stylistic/padding-line-between-statements": [
        "warn",
        // Всегда добавлять пустую строку перед return
        { blankLine: "always", prev: "*", next: "return" },

        // Всегда добавлять пустую строку после const, let, var
        { blankLine: "always", prev: ["const", "let", "var"], next: "*" },
        {
          blankLine: "any",
          prev: ["const", "let", "var"],
          next: ["const", "let", "var"],
        },

        // Всегда добавлять пустую строку до и после функций
        { blankLine: "always", prev: ["function"], next: "*" },
        { blankLine: "always", prev: "*", next: ["function"] },

        // Всегда добавлять пустую строку до и после типов или интерфейсов
        { blankLine: "always", prev: ["type", "interface"], next: "*" },
        { blankLine: "always", prev: "*", next: ["type", "interface"] },
      ],
      "@stylistic/lines-between-class-members": ["warn", "always"],
    },
  },

  // Правила для импортов
  {
    settings: {
      "import/resolver": {
        typescript: {
          project: "./tsconfig.json",
        },
      },
    },
    extends: [pluginImport.flatConfigs.recommended],
    rules: {
      "import/first": ["error"],
      "import/newline-after-import": ["warn"],
      "import/no-duplicates": ["warn", { "prefer-inline": false }],
    },
  },

  // Правила для сортировки импортов
  {
    files: ["**/*.{js,ts}"],
    plugins: {
      "simple-import-sort": pluginSimpleImportSort,
    },
    rules: {
      "simple-import-sort/exports": ["error"],
      "simple-import-sort/imports": [
        "error",
        {
          groups: [
            ["^@?\\w"], // Packages
            ["^@/\\w"], // App aliases
            ["^\.\.(?!/?$)", "^\.\./?$"], // Parent imports
            ["^\./(?=.*/)(?!/?$)", "^\.(?!/?$)", "^\./?$"], // Other relative imports
            ["^.+\.?(scss|css)$"], // Styles
            ["^\u0000"], // Side effect imports
          ],
        },
      ],
    },
  },
]);
