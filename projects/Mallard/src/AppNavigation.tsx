import React from 'react'
import {
    CardStyleInterpolators,
    createStackNavigator,
} from '@react-navigation/stack'

import { routeNames } from './navigation/routes'
import { HomeScreen } from './screens/home-screen'
import { IssueScreen } from './screens/issue-screen'
import { EditionsMenuScreen } from './screens/editions-menu-screen'
import { Animated } from 'react-native'
import { ArticleScreen } from './screens/article-screen'

const Stack = createStackNavigator()

const { multiply } = Animated

const cardStyleInterpolator = props => {
    const translateX = multiply(
        props.current.progress.interpolate({
            inputRange: [0, 1],
            outputRange: [props.layouts.screen.width, 0],
            extrapolate: 'clamp',
        }),
        props.inverted,
    )
    console.log(props.inverted)

    return {
        // ...CardStyleInterpolators.forHorizontalIOS(props),
        cardStyle: {
            overflow: 'hidden',
            transform: [
                // Translation for the animation of the current card
                {
                    translateX,
                },
            ],
        },
        overlayStyle: {
            opacity: props.current.progress.interpolate({
                inputRange: [0, 1],
                outputRange: [0, 0.5],
                extrapolate: 'clamp',
            }),
        },
    }
}

const RootStack = () => {
    return (
        <Stack.Navigator
            initialRouteName="Home"
            screenOptions={{ gestureEnabled: false, headerShown: false }}
        >
            <Stack.Screen
                name={routeNames.Issue}
                component={IssueScreen}
                options={{}}
            />
            <Stack.Screen
                name={routeNames.IssueList}
                component={HomeScreen}
                options={{
                    gestureDirection: 'horizontal',
                    cardStyle: { backgroundColor: 'transparent' },
                    cardOverlayEnabled: true,
                    cardStyleInterpolator,
                }}
            />
            <Stack.Screen
                name={routeNames.EditionsMenu}
                component={EditionsMenuScreen}
                options={{
                    gestureDirection: 'horizontal-inverted',
                    cardStyle: { backgroundColor: 'transparent' },
                    cardOverlayEnabled: true,
                    cardStyleInterpolator,
                }}
            />
            <Stack.Screen
                name={routeNames.Article}
                component={ArticleScreen}
                options={{
                    cardStyleInterpolator: props => {
                        return {
                            ...CardStyleInterpolators.forModalPresentationIOS(
                                props,
                            ),
                        }
                    },
                }}
            />
        </Stack.Navigator>
    )
}

export { RootStack }
