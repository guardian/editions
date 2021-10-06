import React, { createContext, useContext, useEffect, useState } from 'react';
import type { AppStateStatus } from 'react-native';
import { AppState } from 'react-native';

const AppStateContext = createContext({ isActive: true });

export const AppStateProvider = ({
	children,
}: {
	children: React.ReactNode;
}) => {
	const [isActive, setIsActive] = useState<boolean>(true);

	useEffect(() => {
		AppState.addEventListener('change', handleAppStateChange);

		return () => {
			AppState.removeEventListener('change', handleAppStateChange);
		};
	}, []);

	const handleAppStateChange = (appState: AppStateStatus) => {
		setIsActive(appState === 'active');
	};

	return (
		<AppStateContext.Provider value={{ isActive }}>
			{children}
		</AppStateContext.Provider>
	);
};

export const useAppState = () => useContext(AppStateContext);
