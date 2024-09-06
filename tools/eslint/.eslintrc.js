module.exports = {
  env: {
    es6: true,
    browser: true,
    jest: true,
    es2020: true,
  },
  extends: [
    // The airbnb config includes configuration for import, react, and jsx-a11y.
    // That means it's the only thing we need here.  We still need to
    // have those eslint-config plugins installed, though - it defines them
    // as peer dependencies.
    'airbnb',
    'airbnb/hooks',
    'airbnb-typescript',
  ],
  globals: {
    newrelic: false,
  },
  ignorePatterns: [
    'module.config.js',
  ],
  parser: '@typescript-eslint/parser',
  parserOptions: {
    requireConfigFile: true,
  },
  plugins: ['@typescript-eslint', 'formatjs'],
  // If you add rule overrides here, add code to test.js that proves you formatted it right.
  rules: {
    'class-methods-use-this': 'off',
    curly: ['error', 'all'],
    'max-len': [
      'error',
      120,
      2,
      {
        ignoreUrls: true,
        ignoreComments: false,
        ignoreRegExpLiterals: true,
        ignoreStrings: true,
        ignoreTemplateLiterals: true,
      },
    ],
    'arrow-parens': 'off',
    'jsx-a11y/label-has-associated-control': ['error', {
      labelComponents: [],
      labelAttributes: [],
      controlComponents: [],
      assert: 'htmlFor',
      depth: 25,
    }],
    'react/jsx-props-no-spreading': 'off',
    'react/react-in-jsx-scope': 'off',
    'react/jsx-one-expression-per-line': 'off',
    'react/destructuring-assignment': 'off',
    'no-plusplus': 'off',
    '@typescript-eslint/comma-dangle': 'off',
    strict: 'off',
    'import/no-extraneous-dependencies': [
      'error',
      {
        devDependencies: [
          '**/*.config.*',
          '**/.eslintrc.*',
          '**/*.test.*',
          '**/setupTest.js',
        ],
      },
    ],
    'import/no-unresolved': [
      'error',
      {
        ignore: [
          'site.config',
        ],
      },
    ],
    // https://github.com/evcohen/eslint-plugin-jsx-a11y/issues/340#issuecomment-338424908
    'jsx-a11y/anchor-is-valid': ['error', {
      components: ['Link'],
      specialLink: ['to'],
    }],
    'formatjs/enforce-description': ['error', 'literal'],
    'import/no-import-module-export': 'off',
    'react/function-component-definition': 'off',
    'react/jsx-filename-extension': [1, { extensions: ['.tsx', '.jsx'] }],
    'react/require-default-props': ['error', {
      classes: 'defaultProps',
      functions: 'ignore',
    }],
  },
};
