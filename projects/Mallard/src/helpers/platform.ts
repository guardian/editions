import { Platform } from 'react-native';

export const iosMajorVersion =
	Platform.OS === 'ios' ? parseInt(Platform.Version, 10) : 0;
