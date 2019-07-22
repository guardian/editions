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
import {
    issueToArticleScreenInterpolator,
    issueToIssueListInterpolator,
} from './interpolators'
import { supportsTransparentCards } from 'src/helpers/features'
import { AuthSwitcherScreen } from 'src/screens/auth-switcher-screen'

const routeNames = {
    Issue: 'Issue',
    Article: 'Article',
    IssueList: 'IssueList',
    Downloads: 'Downloads',
    Settings: 'Settings',
    Endpoints: 'Endpoints',
    GdprConsent: 'GdprConsent',
    SignIn: 'SignIn',
    onboarding: {
        OnboardingStart: 'OnboardingStart',
        OnboardingConsent: 'OnboardingConsent',
        OnboardingConsentInline: 'OnboardingConsentInline',
    },
}

const navOptionsWithGraunHeader = {
    headerStyle: {
        backgroundColor: color.primary,
        borderBottomColor: color.text,
    },
    headerTintColor: color.textOverPrimary,
}

const AppStack = createStackNavigator(
    {
        [routeNames.Issue]: createStackNavigator(
            {
                [routeNames.Issue]: IssueScreen,
                [routeNames.Article]: ArticleScreen,
            },
            {
                transparentCard: true,
                initialRouteName: routeNames.Issue,
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
        ),
        _: createStackNavigator(
            {
                [routeNames.IssueList]: HomeScreen,
                [routeNames.Downloads]: DownloadScreen,
                [routeNames.Settings]: SettingsScreen,
                [routeNames.Endpoints]: ApiScreen,
                [routeNames.GdprConsent]: GdprConsentScreen,
            },
            {
                defaultNavigationOptions: {
                    ...navOptionsWithGraunHeader,
                },
            },
        ),
    },
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
                      containerStyle: {
                          backgroundColor: 'transparent',
                      },
                      transitionSpec: {
                          duration: 500,
                          easing: Easing.elastic(0.5),
                          timing: Animated.timing,
                          useNativeDriver: true,
                      },
                      screenInterpolator: issueToIssueListInterpolator,
                  }),
              }
            : {}),
    },
)

const OnboardingStack = createStackNavigator(
    {
        [routeNames.onboarding.OnboardingStart]: mapNavigationToProps(
            OnboardingIntroScreen,
            nav => ({
                onContinue: () =>
                    nav.navigate(routeNames.onboarding.OnboardingConsent),
            }),
        ),
        [routeNames.onboarding.OnboardingConsent]: createStackNavigator(
            {
                Main: {
                    screen: mapNavigationToProps(
                        OnboardingConsentScreen,
                        nav => ({
                            onContinue: () => nav.navigate('App'),
                            onOpenGdprConsent: () =>
                                nav.navigate(
                                    routeNames.onboarding
                                        .OnboardingConsentInline,
                                ),
                        }),
                    ),
                    navigationOptions: {
                        header: null,
                    },
                },
                [routeNames.onboarding
                    .OnboardingConsentInline]: GdprConsentScreen,
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

const RootNavigator = createAppContainer(
    createSwitchNavigator(
        {
            Main: ({
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
            },
            App: AppStack,
            Onboarding: OnboardingStack,
            [routeNames.SignIn]: mapNavigationToProps(
                AuthSwitcherScreen,
                nav => ({
                    onAuthenticated: () => nav.navigate('App'),
                    onDismiss: () => nav.navigate('App'),
                }),
            ),
        },
        {
            initialRouteName: 'Main',
        },
    ),
)

export { RootNavigator, routeNames }
