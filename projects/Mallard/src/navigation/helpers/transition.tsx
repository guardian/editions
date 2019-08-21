import React, { createContext, useContext } from 'react'
import { Animated } from 'react-native'
import { NavigationContainer, NavigationInjectedProps } from 'react-navigation'

export const minScale = 0.9
export const minOpacity = 0.9
export const radius = 20

export interface PositionInjectedProps {
    position: Animated.Value
}

const PositionContext = createContext(new Animated.Value(0))
export const useNavigatorPosition = () => useContext(PositionContext)

export type NavigatorWrapper = (
    Navigator: NavigationContainer,
    getPosition: () => Animated.Value,
) => NavigationContainer

export const wrapNavigatorWithPosition: NavigatorWrapper = (
    Navigator,
    getPosition,
) => {
    const WithPosition = ({ navigation }: NavigationInjectedProps) => {
        const Asd = Navigator as any
        const position = getPosition()
        return (
            <PositionContext.Provider value={position}>
                <Asd position={position} navigation={navigation} />
            </PositionContext.Provider>
        )
    }
    WithPosition.router = Navigator.router

    return (WithPosition as unknown) as NavigationContainer
}
