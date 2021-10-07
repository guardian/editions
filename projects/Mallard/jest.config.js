module.exports = {
    preset: 'react-native',
    transformIgnorePatterns: ['/node_modules/(?!(@guardian|react-native|react-native-reanimated))/'],
    moduleFileExtensions: ['ts', 'tsx', 'js', 'jsx', 'json', 'node'],
    setupFiles: [
        './node_modules/react-native-gesture-handler/jestSetup.js',
        './jest-setup.js',
    ],
    testMatch: ['**/__tests__/**/?(*.)+(spec|test).[jt]s?(x)'],
}
