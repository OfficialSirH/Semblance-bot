import { FlatCompat } from '@eslint/eslintrc';
import js from '@eslint/js';
import typescriptEslint from '@typescript-eslint/eslint-plugin';
import tsParser from '@typescript-eslint/parser';
import globals from 'globals';
import path from 'node:path';
import { fileURLToPath } from 'node:url';

const __filename = fileURLToPath(import.meta.url);
const __dirname = path.dirname(__filename);
const compat = new FlatCompat({
  baseDirectory: __dirname,
  recommendedConfig: js.configs.recommended,
  allConfig: js.configs.all,
});

export default [
  ...compat.extends(
    'eslint:recommended',
    'plugin:@typescript-eslint/recommended',
    'prettier',
    'plugin:prettier/recommended',
  ),
  {
    plugins: {
      '@typescript-eslint': typescriptEslint,
    },

    languageOptions: {
      globals: {
        ...globals.node,
      },

      parser: tsParser,
      ecmaVersion: 12,
      sourceType: 'module',
    },

    rules: {
      'linebreak-style': ['error', 'unix'],

      quotes: [
        'error',
        'single',
        {
          avoidEscape: true,
        },
      ],

      semi: ['error', 'always'],

      'no-empty': [
        'error',
        {
          allowEmptyCatch: true,
        },
      ],

      '@typescript-eslint/consistent-type-imports': 'error',

      'prettier/prettier': [
        'error',
        {
          singleQuote: true,
          printWidth: 120,
          quoteProps: 'as-needed',
          trailingComma: 'all',
          endOfLine: 'lf',
          arrowParens: 'avoid',
        },
      ],

      'no-duplicate-imports': 'error',
    },
  },
];
