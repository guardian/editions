import { useEffect } from 'react'
import {
    createStackNavigator,
    createAppContainer,
    createSwitchNavigator,
} from 'react-navigation'
import { HomeScreen } from '../screens/home-screen'
import { IssueScreen } from '../screens/issue-screen'
import { ArticleScreen } from '../screens/article-screen'
import { SettingsScreen } from '../screens/settings-screen'
import { DownloadScreen } from '../screens/settings/download-screen'
import { ApiScreen } from '../screens/settings/api-screen'
import { color } from 'src/theme/color'
import { Animated, Easing } from 'react-native'
import { useSettings } from 'src/hooks/use-settings'
import { OnboardingHandler } from 'src/onboarding'
import { NavigationScreenProp } from 'react-navigation'
import { mapNavigationToProps, withPersistenceKey } from './helpers'
import { shouldShowOnboarding } from 'src/helpers/settings'
import { issueToArticleScreenInterpolator } from './interpolators'

const AppStack = createStackNavigator(
    {
        Main: createStackNavigator(
            {
                Home: HomeScreen,
                Issue: IssueScreen,
                Downloads: DownloadScreen,
                Settings: SettingsScreen,
                Endpoints: ApiScreen,
            },
            {
                defaultNavigationOptions: {
                    headerStyle: {
                        backgroundColor: color.palette.brand.dark,
                        borderBottomColor: color.text,
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
        transitionConfig: () => ({
            containerStyle: {
                backgroundColor: 'transparent',
            },
            transitionSpec: {
                duration: 300,
                easing: Easing.ease,
                timing: Animated.timing,
                useNativeDriver: true,
            },
            screenInterpolator: issueToArticleScreenInterpolator,
        }),
        defaultNavigationOptions: {
            gesturesEnabled: false,
        },
    },
)

const OnboardingStack = createStackNavigator(
    {
        Start: mapNavigationToProps(OnboardingHandler, nav => ({
            onComplete: () => nav.navigate('App'),
        })),
    },
    {
        headerMode: 'none',
    },
)

const OnboardingSwitcher = ({
    navigation,
}: {
    navigation: NavigationScreenProp<{}>
}) => {
    const [settings] = useSettings()
    useEffect(() => {
        if (shouldShowOnboarding(settings)) {
            navigation.navigate('Onboarding')
        } else {
            navigation.navigate('App')
        }
    })
    return null
}

const navigationPersistenceKey = __DEV__ ? 'nav-dfddsf' : null

const RootNavigator = createAppContainer(
    createSwitchNavigator(
        {
            App: withPersistenceKey(AppStack, navigationPersistenceKey),
            Onboarding: withPersistenceKey(
                OnboardingStack,
                navigationPersistenceKey,
            ),
            OnboardingSwitcher,
        },
        {
            initialRouteName: 'OnboardingSwitcher',
        },
    ),
)

export { RootNavigator }
