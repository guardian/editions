import type { GeolocationResponse } from '@react-native-community/geolocation';
import Geolocation from '@react-native-community/geolocation';
import { Platform } from 'react-native';
import { getTemperatureUnit } from 'react-native-localize';
import { RESULTS } from 'react-native-permissions';
import type { AccuWeatherLocation, Forecast } from 'src/common';
import { locale } from 'src/helpers/locale';
import { resolveLocationPermissionStatus } from 'src/helpers/location-permission';

class CannotFetchError extends Error {}

/**
 * Throw strongly typed error on network error, most notably
 * is connection is down. Allows us to process this correctly downstream.
 */
const tryFetch = async (url: string): Promise<Response> => {
	try {
		return await fetch(url);
	} catch (error) {
		throw new CannotFetchError(error.message);
	}
};

const getIpAddress = async (): Promise<string> => {
	const resp = await tryFetch('https://api.ipify.org');
	return await resp.text();
};

export const getGeolocation = async (): Promise<GeolocationResponse> => {
	return new Promise((resolve, reject) => {
		Geolocation.getCurrentPosition(
			resolve,
			(error) => reject(new Error(error.message)),
			{ enableHighAccuracy: false },
		);
	});
};

const fetchFromWeatherApi = async <T>(path: string): Promise<T> => {
	const res = await tryFetch(
		`https://mobile-weather.guardianapis.com/${path}`,
	);
	if (res.status >= 500) {
		throw new CannotFetchError('Server returned 500'); // 500s don't return json
	}
	return await res.json();
};

const getIpBasedLocation = async () => {
	const ip = await getIpAddress();
	const accuLoc = await fetchFromWeatherApi<AccuWeatherLocation | null>(
		`locations/v1/cities/ipAddress?q=${ip}&details=false`,
	);
	if (accuLoc == null) {
		throw new CannotFetchError('Couldn\t identify location from latlong');
	}
	return { accuLoc, isPrecise: false };
};

const getCurrentLocation = async () => {
	const permStatus = await resolveLocationPermissionStatus();
	if (permStatus !== RESULTS.GRANTED) {
		return await getIpBasedLocation();
	}
	let geoloc;
	try {
		geoloc = await getGeolocation();
	} catch (error) {
		return await getIpBasedLocation();
	}
	const latLong = `${geoloc.coords.latitude},${geoloc.coords.longitude}`;
	const accuLoc = await fetchFromWeatherApi<AccuWeatherLocation | null>(
		`locations/v1/cities/geoposition/search?q=${latLong}&details=false`,
	);
	if (accuLoc == null) {
		throw new CannotFetchError('Couldn\t identify location from latlong');
	}
	return { accuLoc, isPrecise: true };
};

export type Weather = {
	locationName: string;
	isLocationPrecise: boolean;
	forecasts: Forecast[];
	lastUpdated: number;
};

const makeWeatherObject = (
	accuLoc: AccuWeatherLocation,
	isPrecise: boolean,
	forecasts: Forecast[],
): Weather => ({
	locationName: accuLoc.EnglishName,
	isLocationPrecise: isPrecise,
	forecasts,
	lastUpdated: Date.now(),
});

const shouldUseMetric = (): boolean => {
	return Platform.select({
		ios: getTemperatureUnit() === 'celsius',
		android: locale === 'en_US' ? false : true,
		default: getTemperatureUnit() === 'celsius',
	});
};

export const getWeather = async (
	fallback: Weather | null,
): Promise<Weather | null> => {
	try {
		const { accuLoc, isPrecise } = await getCurrentLocation();
		const forecasts = await fetchFromWeatherApi<Forecast[]>(
			`forecasts/v1/hourly/12hour/${
				accuLoc.Key
			}.json?metric=${shouldUseMetric()}&language=en-gb`,
		);
		return makeWeatherObject(accuLoc, isPrecise, forecasts);
	} catch (error) {
		if (!(error instanceof CannotFetchError)) throw error;
		if (fallback != null) return fallback;
		return null;
	}
};
