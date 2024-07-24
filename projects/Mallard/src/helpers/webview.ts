import { Platform } from 'react-native';
import { bundles } from '../html-bundle-info.json';

export const getBundleUri = (
	key: keyof typeof bundles,
	use?: 'dev' | 'prod',
): string => {
	const devPath = bundles[key].watchPort;
	const prodPath = bundles[key].key;
	const uris = {
		//10.0.2.2 is a special IP directing to the host dev machine from within the emulator
		dev:
			Platform.OS === 'android'
				? `http://10.0.2.2:${devPath}`
				: `http://localhost:${devPath}`,
		prod:
			Platform.OS === 'android'
				? `file:///android_asset/${prodPath}.bundle/index.html`
				: `${prodPath}.bundle/index.html`,
	};
	if (!use) {
		return __DEV__ ? uris.dev : uris.prod;
	}
	return uris[use];
};

export const parsePing = (data: string) => JSON.parse(data);
