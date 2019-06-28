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
import {
    OnboardingIntroScreen,
    OnboardingConsentScreen,
} from 'src/screens/onboarding-screen'
import { GdprConsentScreen } from 'src/screens/settings/gdpr-consent-screen'
import { NavigationScreenProp } from 'react-navigation'
import { mapNavigationToProps } from './helpers'
import { shouldShowOnboarding } from 'src/helpers/settings'
import { issueToArticleScreenInterpolator } from './interpolators'
import { AuthSwitcherScreen } from 'src/screens/auth-switcher-screen'
import { SignoutScreen } from 'src/screens/signout-screen'

const navOptionsWithGraunHeader = {
    headerStyle: {
        backgroundColor: color.palette.brand.dark,
        borderBottomColor: color.text,
    },
    headerTintColor: color.textOverPrimary,
}

const AppStack = createStackNavigator(
    {
        Main: createStackNavigator(
            {
                Issue: IssueScreen,
                Home: HomeScreen,
                Downloads: DownloadScreen,
                Settings: SettingsScreen,
                Endpoints: ApiScreen,
                GdprConsent: GdprConsentScreen,
            },
            {
                defaultNavigationOptions: {
                    ...navOptionsWithGraunHeader,
                },
                initialRouteName: 'Issue',
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
                duration: 500,
                easing: Easing.elastic(1.1),
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
        OnboardingStart: mapNavigationToProps(OnboardingIntroScreen, nav => ({
            onContinue: () => nav.navigate('OnboardingConsent'),
        })),
        OnboardingConsent: createStackNavigator(
            {
                Main: {
                    screen: mapNavigationToProps(
                        OnboardingConsentScreen,
                        nav => ({
                            onContinue: () => nav.navigate('App'),
                            onOpenGdprConsent: () =>
                                nav.navigate('OnboardingConsentInline'),
                        }),
                    ),
                    navigationOptions: {
                        header: null,
                    },
                },
                OnboardingConsentInline: GdprConsentScreen,
            },
            {
                mode: 'modal',
                defaultNavigationOptions: {
                    ...navOptionsWithGraunHeader,
                },
            },
        ),
    },
    {
        headerMode: 'none',
    },
)

const AuthedStack = createSwitchNavigator(
    {
        Main: ({ navigation }: { navigation: NavigationScreenProp<{}> }) => {
            const [settings] = useSettings()
            useEffect(() => {
                if (shouldShowOnboarding(settings)) {
                    navigation.navigate('Onboarding')
                } else {
                    navigation.navigate('App')
                }
            })
            return null
        },
        App: AppStack,
        Onboarding: OnboardingStack,
    },
    {
        initialRouteName: 'Main',
    },
)

const RootNavigator = createAppContainer(
    createSwitchNavigator(
        {
            Authed: AuthedStack,
            Unauthed: AuthSwitcherScreen,
            Signout: mapNavigationToProps(SignoutScreen, nav => ({
                onSignout: () => {
                    nav.navigate('Unauthed')
                },
            })),
        },
        {
            initialRouteName: 'Unauthed',
        },
    ),
)

export { RootNavigator }
