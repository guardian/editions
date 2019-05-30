import { createStackNavigator, createAppContainer } from 'react-navigation'
import { HomeScreen } from '../screens/home-screen'
import { FrontScreen } from '../screens/front-screen'
import { ArticleScreen } from '../screens/article-screen'
import { SettingsScreen } from '../screens/settings-screen'
import { DownloadScreen } from '../screens/settings/download-screen'
import { ApiScreen } from '../screens/settings/api-screen'
import { color } from '../theme/color'
import { Animated, Easing } from 'react-native'

export const RootNavigator = createAppContainer(
    createStackNavigator(
        {
            Main: createStackNavigator(
                {
                    Home: HomeScreen,
                    Front: FrontScreen,
                    Downloads: DownloadScreen,
                    Settings: SettingsScreen,
                    Endpoints: ApiScreen,
                },
                {
                    defaultNavigationOptions: {
                        headerStyle: {
                            backgroundColor: color.primary,
                        },
                        headerTintColor: color.textOverPrimary,
                    },
                    initialRouteName: 'Home',
                },
            ),
            Article: ArticleScreen,
        },
        {
            transparentCard: true,
            initialRouteName: 'Main',
            mode: 'modal',
            headerMode: 'none',
            cardOverlayEnabled: true,
            transitionConfig: () => {
                return {
                    transitionSpec: {
                        duration: 500,
                        easing: Easing.elastic(0.75),
                        timing: Animated.timing,
                        useNativeDriver: true,
                    },
                    screenInterpolator: sceneProps => {
                        const { layout, position, scene } = sceneProps
                        const thisSceneIndex = scene.index

                        const translateY = position.interpolate({
                            inputRange: [thisSceneIndex - 1, thisSceneIndex],
                            outputRange: [layout.initHeight, 0],
                        })
                        const scale = position.interpolate({
                            inputRange: [thisSceneIndex - 1, thisSceneIndex],
                            outputRange: [1.033, 1],
                        })

                        return scene.route.routeName === 'Main'
                            ? {
                                  transform: [{ scale }],
                                  borderRadius: 26,
                                  overflow: 'hidden',
                              }
                            : { transform: [{ translateY }] }
                    },
                }
            },
            defaultNavigationOptions: {
                gesturesEnabled: false,
            },
        },
    ),
)
