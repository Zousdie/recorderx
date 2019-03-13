const { NODE_ENV } = process.env;

module.exports = {
  root: true,

  extends: ['airbnb-base'],

  parserOptions: {
    ecmaVersion: 2018,
    sourceType: "module"
  },

  parser: "babel-eslint",

  env: {
    es6: true,
    node: true,
    browser: true
  },

  globals: {
    window: false,
    document: false,
    navigator: false
  },

  rules: {
    'no-console': NODE_ENV === 'production'
      ? ['error', { allow: ['warn', 'error'] }]
      : 'off',
    'no-debugger': NODE_ENV === 'production'
      ? 'error'
      : 'off',
    'linebreak-style': ['error', 'unix'],
    'max-len': ['error', { code: 120 }],
    'no-param-reassign': 'off',
    'func-names': 'off',
    'space-before-function-paren': [
      'error',
      {
        anonymous: 'always',
        named: 'always',
        asyncArrow: 'always',
      },
    ]
  }
};
