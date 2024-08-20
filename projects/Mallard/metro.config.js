const { resolve } = require('path');
const { getDefaultConfig, mergeConfig } = require('@react-native/metro-config');
/**
 * Metro configuration
 * https://reactnative.dev/docs/metro
 *
 * @type {import('metro-config').MetroConfig}
 */

const config = {
	watchFolders: [resolve(__dirname, '.'), resolve(__dirname, '../crosswords-bundle'), resolve(__dirname, '../scripts'), resolve(__dirname, '../common')],
};

module.exports = mergeConfig(getDefaultConfig(__dirname), config);
