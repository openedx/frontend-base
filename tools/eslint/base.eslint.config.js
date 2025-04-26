// @ts-check

const { fixupPluginRules } = require('@eslint/compat');
const eslint = require('@eslint/js');
const formatjs = require('eslint-plugin-formatjs');
const jest = require('eslint-plugin-jest');
const jsxA11y = require('eslint-plugin-jsx-a11y');
const react = require('eslint-plugin-react');
const reactHooks = require('eslint-plugin-react-hooks');
const globals = require('globals');
const tseslint = require('typescript-eslint');
const stylistic = require('@stylistic/eslint-plugin');

module.exports = tseslint.config(
  eslint.configs.recommended,
  ...tseslint.configs.stylisticTypeChecked,
  ...tseslint.configs.recommended,
  stylistic.configs['recommended-flat'],
  {
    ignores: [
      'coverage/*',
      'dist/*',
      'node_modules/*',
      '**/__mocks__/*',
      '**/__snapshots__/*',
    ],
  },
  {
    languageOptions: {
      parserOptions: {
        projectService: true,
      }
    }
  },
  {
    languageOptions: {
      ...(react.configs.flat !== undefined ? react.configs.flat.recommended.languageOptions : {}),
      globals: {
        ...globals.browser,
        ...globals.node,
        ...globals.jest,
        newrelic: 'readonly',
      },
    },
    plugins: {
      jest,
      // Type assertion is workaround for incorrect TypeScript
      // types in eslint-plugin-react
      //
      // TODO: Remove when types are fixed in eslint-plugin-react
      // - https://github.com/jsx-eslint/eslint-plugin-react/issues/3838
      react: /** @type {import('eslint').ESLint.Plugin} */ (react),
      'react-hooks': fixupPluginRules(reactHooks),
      formatjs,
      'jsx-a11y': jsxA11y,
    },
    settings: {
      react: {
        version: 'detect',
      }
    }
  },
  {
    rules: {
      // For some reasons the 'flat' key in react.configs is optional, so Typescript complains if
      // we don't guard using it.  But... it exists in the export, so something's odd with their types.
      ...(react.configs.flat !== undefined ? react.configs.flat.recommended.rules : {}),
      ...(react.configs.flat !== undefined ? react.configs.flat['jsx-runtime'].rules : {}),
      ...reactHooks.configs.recommended.rules,
      '@typescript-eslint/no-explicit-any': 'off',
      '@typescript-eslint/non-nullable-type-assertion-style': 'off',
      'react/no-array-index-key': 'error',
      'formatjs/enforce-description': ['error', 'literal'],
      'jsx-a11y/label-has-associated-control': ['error', {
        labelComponents: [],
        labelAttributes: [],
        controlComponents: [],
        assert: 'htmlFor',
        depth: 25,
      }],
      // https://github.com/evcohen/eslint-plugin-jsx-a11y/issues/340#issuecomment-338424908
      'jsx-a11y/anchor-is-valid': ['error', {
        components: ['Link'],
        specialLink: ['to'],
      }],
      '@typescript-eslint/no-unused-vars': ['error', {
        caughtErrors: 'none',
      }],
      '@typescript-eslint/no-empty-function': 'off',
      '@stylistic/semi': ['error', 'always', { omitLastInOneLineBlock: true, omitLastInOneLineClassBody: true }],
      '@stylistic/quotes': ['error', 'single', {
        avoidEscape: true,
        allowTemplateLiterals: true,
      }],
      '@stylistic/comma-dangle': 'off',
      '@stylistic/quote-props': ['error', 'as-needed'],
      '@stylistic/arrow-parens': 'off',
      '@stylistic/jsx-one-expression-per-line': 'off',
      '@stylistic/multiline-ternary': 'off',
      '@stylistic/brace-style': ['error', '1tbs'],
      '@stylistic/member-delimiter-style': ['error', {
        multiline: {
          delimiter: 'comma',
          requireLast: true,
        },
        singleline: {
          delimiter: 'comma',
          requireLast: false,
        }
      }],
    },
  },
  {
    files: [
      'babel.config.js',
      'jest.config.js',
      'eslint.config.js'
    ],
    rules: {
      '@typescript-eslint/no-require-imports': 'off'
    }
  }
);
