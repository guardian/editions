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
import { ArticleWrapper } from './navigation/navigators/article'
import { SettingsScreen } from './screens/settings-screen'
import { AuthSwitcherScreen } from './screens/identity-login-screen'
import { OnboardingConsentScreen } from './screens/onboarding-screen'
import {
    GdprConsentScreenForOnboarding,
    GdprConsentScreen,
} from './screens/settings/gdpr-consent-screen'
import {
    PrivacyPolicyScreen,
    PrivacyPolicyScreenForOnboarding,
} from './screens/settings/privacy-policy-screen'
import { AlreadySubscribedScreen } from './screens/settings/already-subscribed-screen'
import { CasSignInScreen } from './screens/settings/cas-sign-in-screen'
import { ManageEditionsScreenWithHeader } from './screens/settings/manage-editions-screen'
import { BetaProgrammeFAQsScreen } from './screens/settings/beta-programme-faqs'
import { CreditsScreen } from './screens/settings/credits-screen'
import { EditionsScreen } from './screens/settings/editions-screen'
import { FAQScreen } from './screens/settings/faq-screen'
import { HelpScreen } from './screens/settings/help-screen'
import { SubscriptionDetailsScreen } from './screens/settings/subscription-details-screen'
import { TermsAndConditionsScreen } from './screens/settings/terms-and-conditions-screen'
import { ApiScreen } from './screens/settings/api-screen'

const Stack = createStackNavigator()

const { multiply } = Animated

const cardStyleInterpolator = (props: any) => {
    const translateX = multiply(
        props.current.progress.interpolate({
            inputRange: [0, 1],
            outputRange: [props.layouts.screen.width, 0],
            extrapolate: 'clamp',
        }),
        props.inverted,
    )

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
                component={ArticleWrapper}
                options={{
                    cardStyleInterpolator:
                        CardStyleInterpolators.forModalPresentationIOS,
                    gestureEnabled: true,
                    gestureDirection: 'vertical',
                }}
            />
            <Stack.Screen
                name={routeNames.Settings}
                component={SettingsScreen}
            />
            <Stack.Screen
                name={routeNames.SignIn}
                component={AuthSwitcherScreen}
            />
            {/* <Stack.Screen
                name={routeNames.OnboardingStart}
            /> */}
            <Stack.Screen
                name={routeNames.onboarding.OnboardingConsent}
                component={OnboardingConsentScreen}
            />
            <Stack.Screen
                name={routeNames.onboarding.OnboardingConsentInline}
                component={GdprConsentScreenForOnboarding}
            />
            <Stack.Screen
                name={routeNames.onboarding.PrivacyPolicyInline}
                component={PrivacyPolicyScreenForOnboarding}
            />
            <Stack.Screen
                name={routeNames.AlreadySubscribed}
                component={AlreadySubscribedScreen}
            />
            <Stack.Screen
                name={routeNames.CasSignIn}
                component={CasSignInScreen}
            />
            <Stack.Screen
                name={routeNames.ManageEditionsSettings}
                component={ManageEditionsScreenWithHeader}
            />
            {/** @TODO Fix the enable all button */}
            <Stack.Screen
                name={routeNames.GdprConsent}
                component={GdprConsentScreen}
            />
            <Stack.Screen
                name={routeNames.PrivacyPolicy}
                component={PrivacyPolicyScreen}
            />

            {/* ==== Inspect from here === */}
            <Stack.Screen
                name={routeNames.Edition}
                component={EditionsScreen}
            />
            <Stack.Screen
                name={routeNames.TermsAndConditions}
                component={TermsAndConditionsScreen}
            />
            <Stack.Screen
                name={routeNames.BetaProgrammeFAQs}
                component={BetaProgrammeFAQsScreen}
            />
            <Stack.Screen name={routeNames.Help} component={HelpScreen} />
            <Stack.Screen name={routeNames.Credits} component={CreditsScreen} />
            <Stack.Screen name={routeNames.FAQ} component={FAQScreen} />
            <Stack.Screen
                name={routeNames.SubscriptionDetails}
                component={SubscriptionDetailsScreen}
            />
            <Stack.Screen name={routeNames.Endpoints} component={ApiScreen} />
            {/* Turned off to remove Promise rejection error on Android */}
            {/* <Stack.Screen
                name={routeNames.Storybook}
                component={StorybookScreen}
            /> */}
        </Stack.Navigator>
    )
}

export { RootStack }
