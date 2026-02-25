// eslint.config.mjs
import next from '@next/eslint-plugin-next'
import typescriptParser from '@typescript-eslint/parser'
import prettierPlugin from 'eslint-plugin-prettier'
import typescriptEslintPlugin from '@typescript-eslint/eslint-plugin'

export default [
  {
    files: ['**/*.ts', '**/*.tsx'],
    languageOptions: {
      parser: typescriptParser,
      parserOptions: {
        ecmaFeatures: { jsx: true },
        sourceType: 'module',
      },
    },
    plugins: {
      '@next/next': next,
      '@typescript-eslint': typescriptEslintPlugin,
      prettier: prettierPlugin,
    },
    rules: {
      // === ОСНОВНЫЕ ПРАВИЛА ДЛЯ ЧИСТКИ ===
      'no-unused-vars': 'off', // отключаем стандартное правило JS
      '@typescript-eslint/no-unused-vars': [
        'error',
        {
          argsIgnorePattern: '^_',     // игнорировать аргументы вроде _event
          varsIgnorePattern: '^_',     // игнорировать переменные вроде _unused
          caughtErrorsIgnorePattern: '^_', // игнорировать ошибки вроде _err
        }
      ],
      '@typescript-eslint/no-unused-expressions': 'error',

      // === ВАШИ СУЩЕСТВУЮЩИЕ ПРАВИЛА ===
      '@next/next/no-html-link-for-pages': 'error',
      'prettier/prettier': 'error',
      '@typescript-eslint/no-explicit-any': 'error',

      // === ПОИСК НЕНУЖНЫХ КОММЕНТАРИЕВ ===
      'no-warning-comments': [
        'warn',
        {
          terms: ['TODO', 'FIXME', 'УДАЛЕНО', '===', 'HACK', 'DEBUG'],
          location: 'anywhere'
        }
      ]
    },
  },
]