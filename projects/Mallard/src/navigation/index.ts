import { useEffect } from 'react'
import {
    createAppContainer,
    createStackNavigator,
    createSwitchNavigator,
    NavigationScreenProp,
    StackViewTransitionConfigs,
    NavigationTransitionProps,
} from 'react-navigation'
import { AuthSwitcherScreen } from 'src/screens/identity-login-screen'
import { OnboardingConsentScreen } from 'src/screens/onboarding-screen'
import { AlreadySubscribedScreen } from 'src/screens/settings/already-subscribed-screen'
import { SubscriptionDetailsScreen } from 'src/screens/settings/subscription-details-screen'
import { ApiScreen } from 'src/screens/settings/api-screen'
import { CasSignInScreen } from 'src/screens/settings/cas-sign-in-screen'
import { CreditsScreen } from 'src/screens/settings/credits-screen'
import { FAQScreen } from 'src/screens/settings/faq-screen'
import {
    GdprConsentScreen,
    GdprConsentScreenForOnboarding,
} from 'src/screens/settings/gdpr-consent-screen'
import { HelpScreen } from 'src/screens/settings/help-screen'
import {
    PrivacyPolicyScreen,
    PrivacyPolicyScreenForOnboarding,
} from 'src/screens/settings/privacy-policy-screen'
import { TermsAndConditionsScreen } from 'src/screens/settings/terms-and-conditions-screen'
import { color } from 'src/theme/color'
import { ArticleScreen } from '../screens/article-screen'
import { HomeScreen } from '../screens/home-screen'
import { IssueScreen } from '../screens/issue-screen'
import { SettingsScreen } from '../screens/settings-screen'
import { mapNavigationToProps } from './helpers/base'
import { createArticleNavigator } from './navigators/article'
import { createHeaderStackNavigator } from './navigators/header'
import { createModalNavigator } from './navigators/modal'
import { createUnderlayNavigator } from './navigators/underlay'
import { routeNames } from './routes'
import { useQuery } from 'src/hooks/apollo'
import gql from 'graphql-tag'
import { ManageEditionsScreen } from 'src/screens/settings/manage-editions-screen'
import { WeatherGeolocationConsentScreen } from 'src/screens/weather-geolocation-consent-screen'

const navOptionsWithGraunHeader = {
    headerStyle: {
        backgroundColor: color.primary,
        borderBottomColor: color.text,
    },
    headerTintColor: color.textOverPrimary,
}

/* The screens you add to IOS_MODAL_ROUTES will have the modal transition. I.e they will slide up from the bottom. */
const IOS_MODAL_ROUTES = [
    routeNames.onboarding.PrivacyPolicyInline,
    routeNames.onboarding.OnboardingConsentInline,
]

const dynamicModalTransition = (
    transitionProps: NavigationTransitionProps,
    prevTransitionProps: NavigationTransitionProps,
) => {
    const isModal = IOS_MODAL_ROUTES.some(
        screenName =>
            screenName === transitionProps.scene.route.routeName ||
            (prevTransitionProps &&
                screenName === prevTransitionProps.scene.route.routeName),
    )

    return StackViewTransitionConfigs.defaultTransitionConfig(
        transitionProps,
        prevTransitionProps,
        isModal,
    )
}

const AppStack = createModalNavigator(
    createUnderlayNavigator(
        createArticleNavigator(IssueScreen, ArticleScreen),
        {
            [routeNames.IssueList]: HomeScreen,
        },
    ),
    {
        [routeNames.ManageEditions]: createHeaderStackNavigator({
            [routeNames.ManageEditions]: ManageEditionsScreen,
        }),
        [routeNames.Settings]: createHeaderStackNavigator(
            {
                [routeNames.Settings]: SettingsScreen,
                [routeNames.Endpoints]: ApiScreen,
                [routeNames.GdprConsent]: GdprConsentScreen,
                [routeNames.PrivacyPolicy]: PrivacyPolicyScreen,
                [routeNames.TermsAndConditions]: TermsAndConditionsScreen,
                [routeNames.Help]: HelpScreen,
                [routeNames.Credits]: CreditsScreen,
                [routeNames.FAQ]: FAQScreen,
                [routeNames.AlreadySubscribed]: AlreadySubscribedScreen,
                [routeNames.SubscriptionDetails]: SubscriptionDetailsScreen,
            },
            {
                defaultNavigationOptions: {
                    ...navOptionsWithGraunHeader,
                },
            },
        ),
        [routeNames.WeatherGeolocationConsent]: createHeaderStackNavigator({
            [routeNames.WeatherGeolocationConsent]: WeatherGeolocationConsentScreen,
        }),
    },
)

const OnboardingStack = createModalNavigator(
    createStackNavigator(
        {
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
                                onOpenPrivacyPolicy: () =>
                                    nav.navigate(
                                        routeNames.onboarding
                                            .PrivacyPolicyInline,
                                    ),
                            }),
                        ),
                        navigationOptions: {
                            header: null,
                        },
                    },
                    [routeNames.onboarding
                        .OnboardingConsentInline]: GdprConsentScreenForOnboarding,
                    [routeNames.onboarding
                        .PrivacyPolicyInline]: PrivacyPolicyScreenForOnboarding,
                },
                {
                    headerMode: 'none',
                    transitionConfig: dynamicModalTransition,
                    defaultNavigationOptions: {
                        ...navOptionsWithGraunHeader,
                    },
                },
            ),
        },
        {
            headerMode: 'none',
        },
    ),
    {},
)

const ONBOARDING_QUERY = gql(`{
    gdprAllowEssential @client
    gdprAllowPerformance @client
    gdprAllowFunctionality @client
}`)

type OnboardingQueryData = {
    gdprAllowEssential: boolean
    gdprAllowPerformance: boolean
    gdprAllowFunctionality: boolean
}

const hasOnboarded = (data: OnboardingQueryData) => {
    return (
        data.gdprAllowEssential != null &&
        data.gdprAllowFunctionality != null &&
        data.gdprAllowPerformance != null
    )
}

const RootNavigator = createAppContainer(
    createStackNavigator(
        {
            AppRoot: createSwitchNavigator(
                {
                    Main: ({
                        navigation,
                    }: {
                        navigation: NavigationScreenProp<{}>
                    }) => {
                        const query = useQuery<OnboardingQueryData>(
                            ONBOARDING_QUERY,
                        )
                        useEffect(() => {
                            /** Setting is still loading, do nothing yet. */
                            if (query.loading) return
                            const { data } = query
                            // If any flag is unknown still, we want to onboard.
                            // We expected people to give explicit yay/nay to
                            // each GDPR bucket.
                            if (!hasOnboarded(data)) {
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
            ),
            [routeNames.SignIn]: AuthSwitcherScreen,
            [routeNames.CasSignIn]: CasSignInScreen,
        },
        {
            initialRouteName: 'AppRoot',
            mode: 'modal',
            headerMode: 'none',
        },
    ),
)

export { RootNavigator }
