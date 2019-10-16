module.exports = {
    parser: '@typescript-eslint/parser',
    plugins: ['@typescript-eslint', 'prettier', 'react-hooks'],
    extends: [
        'plugin:@typescript-eslint/recommended',
        'plugin:react/recommended',
        'prettier',
        'prettier/@typescript-eslint',
    ],
    settings: {
        react: {
            version: (() => {
                const mallardPackage = require('./projects/Mallard/package.json')
                return mallardPackage.dependencies.react.substring(1)
            })(),
        },
    },
    rules: {
        'prettier/prettier': 'error',
        '@typescript-eslint/explicit-member-accessibility': 'off',
        '@typescript-eslint/explicit-function-return-type': 'off',
        'react/prop-types': 'off',
        '@typescript-eslint/consistent-type-assertions': 'warn',
        '@typescript-eslint/camelcase': 'off',
        'react-hooks/rules-of-hooks': 'error',
        'react-hooks/exhaustive-deps': 'warn',
        'react/display-name': 'off',
    },
    overrides: [
        {
            files: ['*.d.ts'],
            rules: {
                '@typescript-eslint/no-explicit-any': 'off',
            },
        },
        {
            files: ['*.js'],
            rules: { '@typescript-eslint/no-var-requires': 'off' },
        },
        {
            files: ['projects/?allard/src/**/*'],
            rules: { '@typescript-eslint/no-unused-vars': 'error' },
        },
    ],
}
