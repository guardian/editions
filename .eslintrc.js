module.exports = {
    parser: '@typescript-eslint/parser',
    plugins: ['@typescript-eslint', 'prettier'],
    extends: [
        'plugin:@typescript-eslint/recommended',
        'plugin:react/recommended',
        'prettier',
        'prettier/@typescript-eslint',
    ],
    rules: {
        'prettier/prettier': 'error',
        '@typescript-eslint/explicit-member-accessibility': 'off',
        '@typescript-eslint/explicit-function-return-type': 'off',
        'react/prop-types': 'off',
        '@typescript-eslint/no-object-literal-type-assertion': 'warn',
        'react/display-name': 'off'
    },
    overrides: [
        {
            files: ['*.d.ts'],
            rules: {
                '@typescript-eslint/no-explicit-any': 'off',
            },
        },
    ],
}
