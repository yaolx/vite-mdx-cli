module.exports = {
  root: true,
  extends: ['eslint:recommended', 'plugin:@typescript-eslint/recommended'],
  parser: '@typescript-eslint/parser', // 解析器，本解析器支持Ts
  env: {
    browser: true,
    node: true,
    commonjs: true,
    es6: true
  },
  parserOptions: {
    ecmaVersion: 12, // 指定es版本
    sourceType: 'module' // 代码支持es6，使用module
  },
  rules: {
    camelcase: 'warn',
    'no-var': 'error',
    'no-undef': 'off',
    'no-unused-vars': 'off',
    'react/display-name': 0,
    // '@typescript-eslint/no-unused-vars': 'off',
    '@typescript-eslint/camelcase': 'off',
    '@typescript-eslint/member-delimiter-style': 'off',
    '@typescript-eslint/explicit-function-return-type': 'off',
    //'@typescript-eslint/no-explicit-any': 'off',
    '@typescript-eslint/indent': ['error', 2]
  },
  settings: {
    react: {
      version: 'detect'
    }
  }
}
