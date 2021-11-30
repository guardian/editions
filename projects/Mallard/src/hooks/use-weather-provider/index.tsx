import React, {
	createContext,
	useCallback,
	useContext,
	useEffect,
	useState,
} from 'react';
import { isWeatherShownCache } from 'src/helpers/storage';
import { errorService } from 'src/services/errors';

interface WeatherState {
	isWeatherShown: boolean;
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

	useEffect(() => {
		getIsWeatherShown().then((setting) =>
			setIsWeatherShownSetting(setting),
		);
	}, []);

	return (
		<WeatherContext.Provider
			value={{ isWeatherShown, setIsWeatherShownSetting }}
		>
			{children}
		</WeatherContext.Provider>
	);
};

export const useIsWeatherShown = (): IsWeatherShown => ({
	isWeatherShown: useContext(WeatherContext).isWeatherShown,
	setIsWeatherShown: useContext(WeatherContext).setIsWeatherShownSetting,
});
