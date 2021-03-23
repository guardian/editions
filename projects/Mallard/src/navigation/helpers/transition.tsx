import { createContext, useContext } from 'react';
import { Animated } from 'react-native';
import type { NavigationContainer } from 'react-navigation';

export const minScale = 0.9;
export const minOpacity = 0.9;
export const radius = 20;

const PositionContext = createContext(new Animated.Value(1));
export const useNavigatorPosition = () => useContext(PositionContext);

export type NavigatorWrapper = (
	Navigator: NavigationContainer,
	getPosition: () => Animated.Value,
) => NavigationContainer;
