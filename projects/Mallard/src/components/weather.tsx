import { useNavigation } from '@react-navigation/native';
import Moment from 'moment';
import React, { useCallback } from 'react';
import { StyleSheet, Text, View } from 'react-native';
import DeviceInfo from 'react-native-device-info';
import { ErrorBoundary } from 'src/components/layout/ui/errors/error-boundary';
import { useWeather } from 'src/hooks/use-weather-provider';
import { RouteNames } from 'src/navigation/NavigationModels';
import { Breakpoints } from 'src/theme/breakpoints';
import { color } from 'src/theme/color';
import { metrics } from 'src/theme/spacing';
import { getFont } from 'src/theme/typography';
import type { Forecast } from '../common';
import { Button, ButtonAppearance } from './Button/Button';
import { WithBreakpoints } from './layout/ui/sizing/with-breakpoints';
import { WeatherIcon } from './weather/weatherIcon';

type Weather = {
	locationName: string;
	isLocationPrecise: boolean;
	forecasts: Forecast[];
};

const narrowSpace = String.fromCharCode(8201);

export const WEATHER_HEIGHT = DeviceInfo.isTablet() ? 45 : 65;
export const EMPTY_WEATHER_HEIGHT = 8;

const styles = StyleSheet.create({
	shownWeather: {
		marginHorizontal: metrics.horizontal,
		height: WEATHER_HEIGHT,
	},
	emptyWeatherSpace: {
		height: EMPTY_WEATHER_HEIGHT,
	},
	weatherContainer: {
		display: 'flex',
		flexDirection: 'row-reverse',
		width: 'auto',
		marginBottom: 5,
	},
	forecastItem: {
		borderStyle: 'solid',
		justifyContent: 'flex-start',
		alignItems: 'flex-start',
		borderLeftWidth: 1,
		borderLeftColor: color.line,
	},
	forecastItemNarrow: {
		height: WEATHER_HEIGHT - 1,
		width: 45,
		paddingTop: 2,
		paddingLeft: 4,
	},
	forecastItemWide: {
		width: 90,
		display: 'flex',
		flexDirection: 'row',
		paddingLeft: metrics.horizontal * 0.5,
		paddingRight: metrics.horizontal,
		paddingVertical: metrics.vertical / 2,
	},
	forecastText: {
		display: 'flex',
		flexDirection: 'column',
	},
	forecastTextWide: {
		marginLeft: metrics.horizontal * 0.5,
	},
	temperature: {
		color: '#E05E00',
		marginTop: 4,
		...getFont('sans', 0.5),
	},
	dateTime: {
		color: '#000000',
		...getFont('sans', 0.5),
	},
	locationNameContainer: {
		flexDirection: 'row',
		marginTop: metrics.vertical * 0.5,
		marginRight: metrics.horizontal,
		flexShrink: 1,
	},
	locationName: {
		...getFont('sans', 0.5),
		color: '#000000',
		marginTop: 15,
		flexShrink: 1,
	},
	locationPinIcon: {
		fontFamily: 'GuardianIcons-Regular',
		fontSize: 30,
		color: '#ACACAC',
	},
	root: {
		fontFamily: 'weather',
		alignItems: 'flex-start',
		alignSelf: 'flex-start',
		flexDirection: 'row',
		justifyContent: 'flex-start',
		flex: 0,
		width: 'auto',
	},
	setLocationButtonWrap: {
		marginTop: metrics.vertical,
		marginRight: metrics.horizontal * 0.5,
	},
	/**
	 * Exceptionnally, make the button smaller so as to fit in the limited
	 * space on smaller devices.
	 */
	setLocationButton: {
		paddingHorizontal: metrics.horizontal * 0.65,
		height: metrics.buttonHeight * 0.65,
	},
	setLocationText: {
		fontSize: 12,
	},
});

interface WeatherForecast {
	locationName: string;
	forecasts: Forecast[];
}

const WeatherIconView = ({
	forecast,
	iconSize = 1,
}: {
	forecast: Forecast;
	iconSize?: number;
}) => {
	const info = (
		<>
			<Text
				allowFontScaling={false}
				numberOfLines={1}
				ellipsizeMode="clip"
				style={styles.temperature}
			>
				{`${Math.round(forecast.Temperature.Value)}°${
					forecast.Temperature.Unit
				}`}
			</Text>
			<Text
				allowFontScaling={false}
				numberOfLines={1}
				ellipsizeMode="clip"
				style={styles.dateTime}
			>
				{Moment(forecast.DateTime).format(
					`h${narrowSpace /* Narrow space for iPhone 5 */}a`,
				)}
			</Text>
		</>
	);
	const icon = (
		<WeatherIcon
			iconNumber={forecast.WeatherIcon}
			fontSize={30 * iconSize}
		/>
	);

	return (
		<WithBreakpoints>
			{{
				0: () => (
					<View
						style={[styles.forecastItem, styles.forecastItemNarrow]}
					>
						{icon}
						<View style={styles.forecastText}>{info}</View>
					</View>
				),
				[Breakpoints.TabletVertical]: () => (
					<View
						style={[styles.forecastItem, styles.forecastItemWide]}
					>
						{icon}
						<View
							style={[
								styles.forecastText,
								styles.forecastTextWide,
							]}
						>
							{info}
						</View>
					</View>
				),
			}}
		</WithBreakpoints>
	);
};

const SetLocationButton = () => {
	const navigation = useNavigation();
	const onSetLocation = useCallback(() => {
		navigation.navigate(RouteNames.Settings, {
			screen: RouteNames.WeatherGeolocationConsent,
		});
	}, [navigation]);

	return (
		<Button
			accessibilityLabel="Use location button"
			accessibilityHint="Double tap to open a device location consent screen"
			accessibilityRole="button"
			onPress={onSetLocation}
			appearance={ButtonAppearance.Skeleton}
			style={[styles.locationNameContainer, styles.setLocationButtonWrap]}
			buttonStyles={styles.setLocationButton}
			textStyles={styles.setLocationText}
		>
			Use location
		</Button>
	);
};

const LocationName = ({
	isLocationPrecise,
	locationName,
}: {
	isLocationPrecise: boolean;
	locationName: string;
}) => {
	if (!isLocationPrecise) {
		return <SetLocationButton />;
	}
	return (
		<View style={styles.locationNameContainer}>
			<Text style={styles.locationPinIcon}>{'\uE01B'}</Text>
			<Text style={styles.locationName} numberOfLines={2}>
				{locationName}
			</Text>
		</View>
	);
};

const WeatherForecast = ({ weather }: { weather: Weather }) => {
	const { forecasts, locationName, isLocationPrecise } = weather;
	if (forecasts && forecasts.length >= 9) {
		/*Get the hourly forecast in 2 hour intervals from the 12 hour forecast.*/
		const intervals = [8, 6, 4, 2, 0].map((idx) => forecasts[idx]);
		return (
			<View style={styles.weatherContainer}>
				{intervals.map((forecast) => {
					return (
						<WeatherIconView
							key={forecast.EpochDateTime}
							forecast={forecast}
						/>
					);
				})}
				<LocationName
					locationName={locationName}
					isLocationPrecise={isLocationPrecise}
				/>
			</View>
		);
	}
	return <></>;
};

const WeatherWidget = React.memo(() => {
	const weather = useWeather();
	if (weather.lastUpdated === 0 || weather.forecasts.length < 9) {
		return <View style={styles.emptyWeatherSpace} />;
	}

	return (
		<View style={styles.shownWeather}>
			<ErrorBoundary>
				<WeatherForecast weather={weather} />
			</ErrorBoundary>
		</View>
	);
});

export { WeatherWidget };
