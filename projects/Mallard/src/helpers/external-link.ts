import { NativeModules, Platform } from 'react-native';

export const externalLinkCanOpen = (): Promise<boolean> =>
	Platform.OS === 'android' ? false : NativeModules.RNExternalLink.canOpen();

export const externalLinkOpen = (): Promise<void> =>
	Platform.OS === 'android' ? null : NativeModules.RNExternalLink.open();
