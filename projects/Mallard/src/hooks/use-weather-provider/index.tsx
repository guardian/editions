import React, {
	createContext,
	useCallback,
	useContext,
	useEffect,
	useState,
} from 'react';
import type { Forecast } from 'src/common';
import { isWeatherShownCache } from 'src/helpers/storage';
import { errorService } from 'src/services/errors';
import { useAppState } from '../use-app-state-provider';
import type { Weather } from './utils';
import { getWeather } from './utils';

interface WeatherState {
	isWeatherShown: boolean;
	locationName: string;
	isLocationPrecise: boolean;
	forecasts: Forecast[];
	lastUpdated: number;
}

export type IsWeatherShown = {
	isWeatherShown: WeatherState['isWeatherShown'];
	setIsWeatherShown: (setting: boolean) => void;
};

const initialState = {
	isWeatherShown: true,
	setIsWeatherShownSetting: (setting: boolean) => {
		setting;
		return Promise.resolve();
	},
	locationName: '',
	isLocationPrecise: false,
	forecasts: [],
	lastUpdated: 0,
	refreshWeather: () => {},
};

const WeatherContext = createContext(initialState);

export const getIsWeatherShown = async (): Promise<
	WeatherState['isWeatherShown']
> => {
	try {
		const isWeatherShown = await isWeatherShownCache.get();
		return isWeatherShown ?? initialState.isWeatherShown;
	} catch {
		return Promise.resolve(initialState.isWeatherShown);
	}
};

export const WeatherProvider = ({
	children,
}: {
	children: React.ReactNode;
}) => {
	const [isWeatherShown, setIsWeatherShown] = useState<
		WeatherState['isWeatherShown']
	>(initialState.isWeatherShown);

	const [locationName, setLocationName] = useState<
		WeatherState['locationName']
	>(initialState.locationName);

	const [isLocationPrecise, setIsLocationPrecise] = useState<
		WeatherState['isLocationPrecise']
	>(initialState.isLocationPrecise);

	const [forecasts, setForecasts] = useState<WeatherState['forecasts']>(
		initialState.forecasts,
	);

	const [lastUpdated, setLastUpdated] = useState<WeatherState['lastUpdated']>(
		initialState.lastUpdated,
	);

	const { isActive } = useAppState();

	const setIsWeatherShownSetting = useCallback(
		async (setting: boolean) => {
			try {
				await isWeatherShownCache.set(setting);
				setIsWeatherShown(setting);
			} catch (e) {
				e.message = `Unable to Set Is Weather Shown: ${e.message}`;
				errorService.captureException(e);
			}
		},
		[setIsWeatherShown],
	);

	const fetchWeather = useCallback(
		async (fallbackWeather: Weather | null = null) => {
			const weather = await getWeather(fallbackWeather);
			if (weather === null) {
				return;
			}
			const { locationName, isLocationPrecise, forecasts, lastUpdated } =
				weather;
			setLocationName(locationName);
			setIsLocationPrecise(isLocationPrecise);
			setForecasts(forecasts);
			setLastUpdated(lastUpdated);
		},
		[setLocationName, setIsLocationPrecise, setForecasts, setLastUpdated],
	);

	useEffect(() => {
		getIsWeatherShown().then((setting) =>
			setIsWeatherShownSetting(setting),
		);
	}, []);

	useEffect(() => {
		fetchWeather();
	}, []);

	useEffect(() => {
		isActive && fetchWeather();
	}, [isActive]);

	return (
		<WeatherContext.Provider
			value={{
				isWeatherShown,
				setIsWeatherShownSetting,
				locationName,
				isLocationPrecise,
				forecasts,
				lastUpdated,
				refreshWeather: fetchWeather,
			}}
		>
			{children}
		</WeatherContext.Provider>
	);
};

export const useIsWeatherShown = (): IsWeatherShown => ({
	isWeatherShown: useContext(WeatherContext).isWeatherShown,
	setIsWeatherShown: useContext(WeatherContext).setIsWeatherShownSetting,
});

export const useWeather = () => useContext(WeatherContext);
