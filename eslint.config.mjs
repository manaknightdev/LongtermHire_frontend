import reactHooks from 'eslint-plugin-react-hooks';
import tseslint from 'typescript-eslint';

export default [
    {
        ignores: ['dist', 'dev-dist', 'node_modules', 'public', 'vite.config.ts', 'tailwind.config.ts']
    },
    // tseslint.configs.recommendedTypeChecked,
    // tseslint.configs.stylisticTypeChecked,
    {
        files: ['**/*.{ts,tsx,js,jsx}'],
        languageOptions: {
            parser: tseslint.parser,
            parserOptions: {
                project: './tsconfig.json',  // Explicitly point to tsconfig
                tsconfigRootDir: '.',
                ecmaVersion: 'latest',
                sourceType: 'module'
            },
            globals: {
                browser: true,
                es2021: true,
                node: true
            }
        },
        plugins: {
            '@typescript-eslint': tseslint.plugin,
            'react-hooks': reactHooks
        },
        rules: {
            ...reactHooks.configs.recommended.rules,
            'no-unused-vars': 'off', // Turn off base rule
            'eqeqeq': 'error',
            'no-console': 'warn',
            'no-debugger': 'warn',
            '@typescript-eslint/no-explicit-any': 'off',
            '@typescript-eslint/explicit-function-return-type': 'off',
            '@typescript-eslint/no-unused-vars': ['warn', {
                argsIgnorePattern: '^_',
                varsIgnorePattern: '^_'
            }]
        }
    }
];
