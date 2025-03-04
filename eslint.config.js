import globals from 'globals';
import eslintPluginJs from '@eslint/js';
import jasminePlugin from 'eslint-plugin-jasmine';

export default [
	eslintPluginJs.configs.recommended,
	jasminePlugin.configs.recommended,
	{
		files: ['**/*.js'],
		languageOptions: {
			globals: {
				...globals.webdriverio, // Contains browser, $, $$, etc.
				...globals.jasmine, // Contains describe, it, beforeEach, etc.
				MY_CUSTOM_GLOBAL: 'readonly',
			},
			parserOptions: {
				ecmaVersion: 'latest', // For async/await support
			},
		},
		plugins: {
			jasmine: jasminePlugin,
		},
		rules: {
			// General JavaScript rules
			'no-var': 'error',
			'prefer-const': 'error',
			'quotes': ['error', 'single', { avoidEscape: true }],
			'array-bracket-spacing': ['error', 'never'],
			'object-curly-spacing': ['error', 'always'],
			'object-shorthand': ['error', 'always'],
			'prefer-arrow-callback': 'error',
			'arrow-spacing': ['error', { before: true, after: true }],
			'no-unused-vars': [
				'error',
				{
					args: 'none',
					caughtErrors: 'none',
					varsIgnorePattern: '^_',
				},
			],
			'no-use-before-define': ['error', { functions: false, classes: true }],
			'eqeqeq': ['error', 'always'],
			'curly': ['error', 'all'],
			'no-lonely-if': 'error',
			'no-unneeded-ternary': 'error',
			'indent': ['error', 'tab', { SwitchCase: 1 }],
			'semi': ['error', 'always'],
			'comma-dangle': ['error', 'always-multiline'],
			'no-new-wrappers': 'error',
			'camelcase': ['error', { properties: 'never' }],
			'no-console': 'warn',
			'max-len': ['error', { code: 150, ignoreUrls: true }],
			'object-property-newline': ['error', { allowAllPropertiesOnSameLine: true }],
			'no-multiple-empty-lines': ['error', { max: 1 }],
			'no-trailing-spaces': 'error',

			// Jasmine-specific overrides
			'jasmine/no-focused-tests': 'error',
			'jasmine/no-disabled-tests': 'warn',
			'jasmine/no-spec-dupes': ['error', 'branch'],
			'jasmine/no-unsafe-spy': 'error',
			'jasmine/prefer-jasmine-matcher': 'error',
			'jasmine/prefer-toHaveBeenCalledWith': 'error',

			// Disabled rules that conflict with test patterns
			'func-style': 'off',
			'jasmine/prefer-promise-strategies': 'off',

			// WebdriverIO specific allowances
			'no-underscore-dangle': 'off',
			'consistent-return': 'off',
		},
	},
];
