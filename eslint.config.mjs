import globals from 'globals';
import pluginJs from '@eslint/js';

/** @type {import('eslint').Linter.Config[]} */
export default [
    { files: ['**/*.js'], languageOptions: { sourceType: 'commonjs' } },
    { languageOptions: { globals: { ...globals.browser, ...globals.node } } },
    pluginJs.configs.recommended,
    { ignores: ['**/node_modules/**', '**/dist/**'] },
    {
        rules: {
            'eqeqeq': ['error', 'always'],
            'curly': 'error',
            'indent': ['error', 4],
            'semi': ['error', 'always'],
            'quotes': ['error', 'single'],
            'no-else-return': 'error',
            'prefer-const': 'error',
            'no-multiple-empty-lines': ['error', { 'max': 1 }],
            'newline-before-return': 'error',
            'array-bracket-newline': ['error', { 'multiline': true }],
            'object-curly-newline': ['error', { 'multiline': true }],
            'no-var': 'error',
            'object-shorthand': ['error', 'always']
        }
    }
];