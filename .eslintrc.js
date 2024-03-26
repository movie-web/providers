module.exports = {
  env: {
    browser: true,
  },
  extends: ['airbnb-base', 'plugin:@typescript-eslint/recommended', 'plugin:prettier/recommended'],
  ignorePatterns: ['lib/*', 'tests/*', '/*.js', '/*.ts', '/src/__test__/*', '/**/*.test.ts', 'test/*'],
  parser: '@typescript-eslint/parser',
  parserOptions: {
    project: './tsconfig.json',
    tsconfigRootDir: './',
  },
  settings: {
    'import/resolver': {
      typescript: {
        project: './tsconfig.json',
      },
    },
  },
  plugins: ['@typescript-eslint', 'import', 'prettier'],
  rules: {
    'no-plusplus': 'off',
    'class-methods-use-this': 'off',
    'no-bitwise': 'off',
    'no-underscore-dangle': 'off',
    '@typescript-eslint/no-explicit-any': 'off',
    'no-console': ['error', { allow: ['warn', 'error'] }],
    '@typescript-eslint/no-this-alias': 'off',
    'import/prefer-default-export': 'off',
    '@typescript-eslint/no-empty-function': 'off',
    'no-shadow': 'off',
    '@typescript-eslint/no-shadow': ['error'],
    'no-restricted-syntax': 'off',
    'import/no-unresolved': ['error', { ignore: ['^virtual:'] }],
    'consistent-return': 'off',
    'no-continue': 'off',
    'no-eval': 'off',
    'no-await-in-loop': 'off',
    'no-nested-ternary': 'off',
    'no-param-reassign': ['error', { props: false }],
    'prefer-destructuring': 'off',
    '@typescript-eslint/no-unused-vars': ['warn', { argsIgnorePattern: '^_' }],
    'import/extensions': [
      'error',
      'ignorePackages',
      {
        ts: 'never',
        tsx: 'never',
      },
    ],
    'import/order': [
      'error',
      {
        groups: ['builtin', 'external', 'internal', ['sibling', 'parent'], 'index', 'unknown'],
        'newlines-between': 'always',
        alphabetize: {
          order: 'asc',
          caseInsensitive: true,
        },
      },
    ],
    'sort-imports': [
      'error',
      {
        ignoreCase: false,
        ignoreDeclarationSort: true,
        ignoreMemberSort: false,
        memberSyntaxSortOrder: ['none', 'all', 'multiple', 'single'],
        allowSeparatedGroups: true,
      },
    ],
  },
};
