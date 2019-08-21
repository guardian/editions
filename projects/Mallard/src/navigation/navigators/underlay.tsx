import React, { createContext, FunctionComponent, useContext } from 'react'
import { Animated, Dimensions, StyleSheet } from 'react-native'
import {
    createStackNavigator,
    NavigationContainer,
    NavigationInjectedProps,
    NavigationRouteConfig,
    NavigationTransitionProps,
    NavigationContainerProps,
} from 'react-navigation'
import { supportsTransparentCards } from 'src/helpers/features'
import { color } from 'src/theme/color'
import { metrics } from 'src/theme/spacing'
import { PositionInjectedProps } from '../helpers'

const PositionContext = createContext(new Animated.Value(0))
export const useNavigatorPosition = () => useContext(PositionContext)

const wrapNavigatorWithPosition = (
    Navigator: NavigationContainer,
    getPosition: () => Animated.Value,
): NavigationContainer => {
    const WithPosition = ({ navigation }: NavigationInjectedProps) => {
        const position = getPosition()
        return (
            <PositionContext.Provider value={position}>
                <Navigator position={position} navigation={navigation} />
            </PositionContext.Provider>
        )
    }
    WithPosition.router = Navigator.router

    return (WithPosition as unknown) as NavigationContainer
}

const wrapNavigatorWithModal = (
    Navigator: NavigationContainer,
    getPosition: () => Animated.Value,
): NavigationContainer => {
    const WithModal = ({ navigation }: NavigationInjectedProps) => {
        return <Navigator position={getPosition()} navigation={navigation} />
    }
    WithModal.router = Navigator.router

    return (WithModal as unknown) as NavigationContainer
}

const radius = 20
const minScale = 0.9
const minOpacity = 0.9

const issueScreenToIssueList = (sceneProps: NavigationTransitionProps) => {
    const { position, scene } = sceneProps
    const sceneIndex = scene.index
    const { height: windowHeight } = Dimensions.get('window')

    const finalTranslate = windowHeight - 80

    const translateY = position.interpolate({
        inputRange: [sceneIndex, sceneIndex + 1],
        outputRange: [0, finalTranslate],
    })
    const borderRadius = position.interpolate({
        inputRange: [sceneIndex, sceneIndex + 1],
        outputRange: [0, radius],
    })

    return {
        zIndex: 9999,
        elevation: 9999,
        borderRadius,
        ...StyleSheet.absoluteFillObject,
        transform: [{ translateY }],
        overflow: 'hidden',
    }
}

const IssueListToIssueScreen = (sceneProps: NavigationTransitionProps) => {
    const { position, scene } = sceneProps
    const sceneIndex = scene.index
    const { height: windowHeight } = Dimensions.get('window')

    /*
    these ones r easy
    */
    const scale = position.interpolate({
        inputRange: [sceneIndex - 1, sceneIndex - 0.1, sceneIndex],
        outputRange: [minScale, 1, 1],
    })
    const borderRadius = position.interpolate({
        inputRange: [sceneIndex - 1, sceneIndex],
        extrapolate: 'clamp',
        outputRange: [radius, 0],
    })
    const opacity = position.interpolate({
        inputRange: [sceneIndex - 1, sceneIndex],
        outputRange: [minOpacity, 1],
    })

    /*
    we wanna control how far from the top edge
    this window lands, to do so we calculate how
    many px it has to move up to account for the
    scale and then we mess with that number
    as we please
    */
    const translateOffset = (windowHeight - windowHeight * minScale) * -0.5
    const finalTranslate = translateOffset + metrics.slideCardSpacing / 1.5

    const translateY = position.interpolate({
        inputRange: [sceneIndex, sceneIndex + 1],
        outputRange: [0, finalTranslate],
    })

    return {
        zIndex: 0,
        elevation: 0,
        transform: [
            { translateY },
            {
                scale,
            },
        ],
        opacity,
        borderRadius,
        overflow: 'hidden',
    }
}

const createUnderlayNavigator = (
    top: NavigationContainer,
    bottom: {
        [name: string]: NavigationRouteConfig
    },
) => {
    let animatedValue = new Animated.Value(0)

    const navigation: { [key: string]: NavigationContainer } = {
        _: wrapNavigatorWithPosition(top, () => animatedValue),
    }
    for (const [key, value] of Object.entries(bottom)) {
        navigation[key] = wrapNavigatorWithPosition(value, () => animatedValue)
    }

    const transitionConfig = (transitionProps: NavigationTransitionProps) => {
        const { position } = transitionProps
        animatedValue = position
        return {
            containerStyle: {
                backgroundColor: color.artboardBackground,
            },
            screenInterpolator: (sceneProps: NavigationTransitionProps) => {
                const { scene } = sceneProps
                if (scene.route.routeName === '_') {
                    return issueScreenToIssueList(sceneProps)
                }
                return IssueListToIssueScreen(sceneProps)
            },
        }
    }

    return createStackNavigator(navigation, {
        initialRouteName: '_',
        defaultNavigationOptions: {
            gesturesEnabled: false,
        },
        ...(supportsTransparentCards()
            ? {
                  mode: 'modal',
                  headerMode: 'none',
                  transparentCard: true,
                  cardOverlayEnabled: true,
                  transitionConfig,
              }
            : {}),
    })
}

export { createUnderlayNavigator }

/**
 *
 *
        {
            defaultNavigationOptions: {
                header: null,
                gesturesEnabled: false,
            },
            initialRouteName: routeNames.Issue,
            ...(supportsTransparentCards()
                ? {
                      transparentCard: true,
                      mode: 'modal',
                      headerMode: 'none',
                      cardOverlayEnabled: true,
                      transitionConfig: () => ({
                          ...transitionOptionsOverArtboard(false),
                          screenInterpolator: issueToIssueListInterpolator,
                      }),
                  }
                : {}),
        },
 */
