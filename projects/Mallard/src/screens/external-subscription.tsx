import { useNavigation } from '@react-navigation/native';
import React from 'react';
import type { ColorSchemeName, TextStyle, ViewStyle } from 'react-native';
import {
	Linking,
	ScrollView,
	StyleSheet,
	Text,
	TouchableOpacity,
	useColorScheme,
	View,
} from 'react-native';
import { getDeviceId, isTablet } from 'react-native-device-info';
import { Copy } from 'src/helpers/words';

const isTabletDevice = isTablet();

// Accounts for iOS devices below iOS16 at launch
const proOrMaxPhoneIds = [
	'iPhone12,3',
	'iPhone12,5',
	'iPhone13,3',
	'iPhone13,4',
	'iPhone14,2',
	'iPhone14,3',
];

const standardUIKitLayoutMargins = (): number => {
	if (isTabletDevice) {
		return 88;
	}
	const deviceId = getDeviceId();
	const isOriginalIPhoneSE = deviceId === 'iPhone8,4';
	if (isOriginalIPhoneSE) {
		return 16;
	}
	const isPhoneProOrMax = proOrMaxPhoneIds.includes(deviceId);
	if (isPhoneProOrMax) {
		return 44;
	}
	return 24;
};

const styles = (colorScheme: ColorSchemeName) => {
	const darkMode = colorScheme === 'dark';
	return StyleSheet.create({
		container: {
			display: 'flex',
			alignItems: 'center',
			justifyContent: 'center',
			flex: 1,
		},
		card: {
			marginVertical: isTabletDevice ? 44 : 0,
			backgroundColor: darkMode ? '#000000' : '#FFFFFF',
			flex: 1,

			paddingHorizontal: standardUIKitLayoutMargins(),
			paddingTop: isTabletDevice ? 88 : 70,
			borderRadius: 14,
			justifyContent: 'space-between',
		},
		largeTitleBold: {
			fontFamily: 'System',
			fontWeight: 'bold',
			fontSize: 34,
			lineHeight: 41,
			marginBottom: isTabletDevice ? 15 : 16,
			color: darkMode ? '#FFFFFF' : '#000000',
			textAlign: 'center',
		},
		headline: {
			fontFamily: 'System',
			fontWeight: 'bold',
			fontSize: 17,
			lineHeight: 22,
			color: darkMode ? '#0A84FF' : '#007AFF',
		},
		body: {
			fontFamily: 'System',
			fontSize: 17,
			lineHeight: 22,
			textAlign: 'center',
			marginBottom: 15,
			color: darkMode ? '#FFFFFF' : '#000000',
		},
		link: {
			fontFamily: 'System',
			fontSize: 17,
			lineHeight: 22,
			color: darkMode ? '#0A84FF' : '#007AFF',
			textAlign: 'center',
		},
		buttonGroup: {
			paddingTop: 24,
			paddingBottom: isTabletDevice ? 28 : 15,
			paddingHorizontal: isTabletDevice ? 44 : 0,
		},
		iOSButton: {
			backgroundColor: darkMode ? '#2C2C2E' : '#F2F2F7',
			borderRadius: 14,
			alignItems: 'center',
			justifyContent: 'center',
			height: 50,
			marginBottom: 12,
		},
	});
};

const IOSButton = ({
	children,
	onPress,
	style,
}: {
	children: string;
	onPress: () => void;
	style: { iOSButton: ViewStyle; headline: TextStyle };
}) => (
	<TouchableOpacity onPress={onPress} style={style.iOSButton}>
		<Text style={style.headline}>{children}</Text>
	</TouchableOpacity>
);

const learnMore = () =>
	Linking.openURL('https://apps.apple.com/story/id1614232807');

const subscribe = () =>
	Linking.openURL('https://support.theguardian.com/uk/subscribe/digital');

export const ExternalSubscriptionScreen = () => {
	const { goBack } = useNavigation();
	const colorScheme = useColorScheme();
	const style = styles(colorScheme);
	return (
		<View style={style.container}>
			<View style={style.card}>
				<ScrollView>
					<Text style={style.largeTitleBold}>
						{Copy.externalSubscription.title}
					</Text>
					<Text style={style.body}>
						{Copy.externalSubscription.body}
					</Text>
					<Text style={style.link} onPress={learnMore}>
						{Copy.externalSubscription.learnMore}
					</Text>
				</ScrollView>

				<View style={style.buttonGroup}>
					<IOSButton
						onPress={() => {
							subscribe();
							goBack();
						}}
						style={style}
					>
						{Copy.externalSubscription.continue}
					</IOSButton>
					<IOSButton onPress={goBack} style={style}>
						{Copy.externalSubscription.cancel}
					</IOSButton>
				</View>
			</View>
		</View>
	);
};
