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
    },
    parserOptions: {
        project: './projects/Mallard/tsconfig.json',
        ecmaFeatures: {
            jsx: true,
        },
    },
}
