// @ts-check
import js from '@eslint/js';
import tseslint from 'typescript-eslint';

export default [
	js.configs.recommended,
	...tseslint.configs.recommended,
	{
		files: ['**/*.ts'],
		languageOptions: {
			parser: tseslint.parser,
			parserOptions: {
				ecmaVersion: 2020,
				sourceType: 'module',
				project: './tsconfig.json',
			},
		},
		rules: {
			'@typescript-eslint/no-unused-vars': ['error', { argsIgnorePattern: '^_', varsIgnorePattern: '^_' }],
			'@typescript-eslint/ban-ts-comment': ['warn', { 'ts-ignore': 'allow-with-description' }],
		},
	},
	{
		files: ['**/__tests__/**/*.ts', '**/*.test.ts'],
		rules: {
			'@typescript-eslint/no-explicit-any': 'off',
			'@typescript-eslint/no-unused-vars': ['warn', { argsIgnorePattern: '^_', varsIgnorePattern: '^_' }],
		},
	},
];


