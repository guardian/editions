import { Animated } from 'react-native'
import {
    createStackNavigator,
    NavigationContainer,
    NavigationRouteConfig,
    NavigationTransitionProps,
} from 'react-navigation'
import { supportsTransparentCards } from 'src/helpers/features'
import { color } from 'src/theme/color'
import { wrapNavigatorWithPosition } from '../helpers/transition'
import { screenInterpolator } from './underlay/transition'

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
        animatedValue = transitionProps.position
        return {
            containerStyle: {
                backgroundColor: color.artboardBackground,
            },
            screenInterpolator,
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
