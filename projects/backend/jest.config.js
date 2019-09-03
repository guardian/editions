module.exports = {
    preset: 'ts-jest/presets/default',
    setupFilesAfterEnv: ['./jest-matchers.ts'],
    testMatch: ['**/__tests__/**/?(*.)+(spec|test).[jt]s?(x)'],
}
