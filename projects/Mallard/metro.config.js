const { resolve } = require('path');
const { getDefaultConfig, mergeConfig } = require('@react-native/metro-config');
/**
 * Metro configuration
 * https://facebook.github.io/metro/docs/configuration
 *
 * @type {import('metro-config').MetroConfig}
 */

const config = {
	watchFolders: [resolve(__dirname, '.'), resolve(__dirname, '../Apps')],
};

module.exports = mergeConfig(getDefaultConfig(__dirname), config);
