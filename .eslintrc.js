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
    },
}
