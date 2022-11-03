import { useNavigation } from '@react-navigation/native';
import { useCallback } from 'react';
import { NativeModules, Platform } from 'react-native';
import { RouteNames } from 'src/navigation/NavigationModels';
import { iosMajorVersion } from './platform';

const externalLinkCanOpen = (): boolean =>
	Platform.OS === 'ios' && iosMajorVersion >= 16;

const externalLinkOpen = (): void => NativeModules.RNExternalLink.open();

export const useExternalLink = () => {
	const { navigate } = useNavigation();
	const canOpen = externalLinkCanOpen();
	const openExternalLink = useCallback(() => {
		if (canOpen) {
			externalLinkOpen();
		} else {
			navigate(RouteNames.ExternalSubscription);
		}
	}, [canOpen]);

	return {
		openExternalLink,
	};
};
