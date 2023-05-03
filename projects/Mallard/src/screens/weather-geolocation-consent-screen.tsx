import { useNavigation } from '@react-navigation/native';
import React from 'react';
import { Alert, Linking, Platform, StyleSheet, View } from 'react-native';
import { RESULTS } from 'react-native-permissions';
import { Button, ButtonAppearance } from 'src/components/Button/Button';
import { HeaderScreenContainer } from 'src/components/Header/Header';
import { RenderHTMLwithScrollView } from 'src/components/RenderHTML/RenderHTML';
import { logEvent } from 'src/helpers/analytics';
import { requestLocationPermission } from 'src/helpers/location-permission';
import { Copy } from 'src/helpers/words';
import { useIsWeatherShown, useWeather } from 'src/hooks/use-weather-provider';
import { getGeolocation } from 'src/hooks/use-weather-provider/utils';
import { metrics } from 'src/theme/spacing';

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
		Copy.weather.disabledLocationAlertTitle,
		Copy.weather.disabledLocationAlertExplainer,
	);
};

const WeatherGeolocationConsentScreen = () => {
	const navigation = useNavigation();
	const { refreshWeather } = useWeather();
	const { setIsWeatherShown } = useIsWeatherShown();
	const onConsentPress = async () => {
		const result = await requestLocationPermission();
		await refreshWeather();
		if (result === RESULTS.BLOCKED) {
			Alert.alert(
				Copy.weather.locationPermissionTitle,
				Copy.weather.locationPermissionExplainer,
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
			<RenderHTMLwithScrollView html={Copy.weatherConsentHtml.content} />
			<View style={styles.buttons}>
				<Button
					appearance={ButtonAppearance.SkeletonBlue}
					onPress={onConsentPress}
					style={styles.button}
				>
					{Copy.weather.acceptLocationButton}
				</Button>
				<Button
					appearance={ButtonAppearance.SkeletonBlue}
					onPress={onHidePress}
					style={styles.button}
				>
					{Copy.weather.cancelButton}
				</Button>
			</View>
		</HeaderScreenContainer>
	);
};

export { WeatherGeolocationConsentScreen };
