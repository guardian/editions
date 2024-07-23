import { useNavigation } from '@react-navigation/native';
import type { NativeStackNavigationProp } from '@react-navigation/native-stack';
import React from 'react';
import { Alert, Linking, Platform, StyleSheet, View } from 'react-native';
import { RESULTS } from 'react-native-permissions';
import { Button, ButtonAppearance } from '../components/Button/Button';
import { HeaderScreenContainer } from '../components/Header/Header';
import { RenderHTMLwithScrollView } from '../components/RenderHTML/RenderHTML';
import { logEvent } from '../helpers/analytics';
import { requestLocationPermission } from '../helpers/location-permission';
import { copy } from '../helpers/words';
import { useIsWeatherShown, useWeather } from '../hooks/use-weather-provider';
import { getGeolocation } from '../hooks/use-weather-provider/utils';
import type { MainStackParamList } from '../navigation/NavigationModels';
import { metrics } from '../theme/spacing';

const styles = StyleSheet.create({
	button: {
		marginTop: metrics.vertical,
	},
	buttons: {
		marginHorizontal: metrics.horizontal,
		marginBottom:
			metrics.vertical * Platform.select({ default: 2, ios: 4 }),
	},
});

const showIsDisabledAlert = () => {
	Alert.alert(
		copy.weather.disabledLocationAlertTitle,
		copy.weather.disabledLocationAlertExplainer,
	);
};

const WeatherGeolocationConsentScreen = () => {
	const navigation =
		useNavigation<NativeStackNavigationProp<MainStackParamList>>();
	const { refreshWeather } = useWeather();
	const { setIsWeatherShown } = useIsWeatherShown();
	const onConsentPress = async () => {
		const result = await requestLocationPermission();
		await refreshWeather();
		if (result === RESULTS.BLOCKED) {
			Alert.alert(
				copy.weather.locationPermissionTitle,
				copy.weather.locationPermissionExplainer,
				[
					{
						text: 'OK',
						onPress: () => {
							Linking.openSettings();
						},
					},
				],
			);
			return;
		}
		if (result === RESULTS.UNAVAILABLE) {
			showIsDisabledAlert();
			return;
		}
		if (result === RESULTS.GRANTED) {
			try {
				await getGeolocation();
			} catch (error) {
				showIsDisabledAlert();
				return;
			}
			navigation.goBack();
		}
		logEvent({
			name: 'weather_consent_button',
			value: 'weather_did_consented',
		});
	};
	const onHidePress = () => {
		setIsWeatherShown(false);
		navigation.goBack();
		logEvent({
			name: 'weather_consent_button',
			value: 'weather_did_not_consent',
		});
	};

	return (
		<HeaderScreenContainer actionLeft={false} actionRight title={''}>
			<RenderHTMLwithScrollView html={copy.weatherConsentHtml.content} />
			<View style={styles.buttons}>
				<Button
					appearance={ButtonAppearance.SkeletonBlue}
					onPress={onConsentPress}
					style={styles.button}
				>
					{copy.weather.acceptLocationButton}
				</Button>
				<Button
					appearance={ButtonAppearance.SkeletonBlue}
					onPress={onHidePress}
					style={styles.button}
				>
					{copy.weather.cancelButton}
				</Button>
			</View>
		</HeaderScreenContainer>
	);
};

export { WeatherGeolocationConsentScreen };
