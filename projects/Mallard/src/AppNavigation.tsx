import { useQuery } from '@apollo/react-hooks';
import { NavigationContainer } from '@react-navigation/native';
import {
	CardStyleInterpolators,
	createStackNavigator,
} from '@react-navigation/stack';
import gql from 'graphql-tag';
import React, { useEffect, useState } from 'react';
import { Animated } from 'react-native';
import { CURRENT_CONSENT_VERSION } from './helpers/settings';
import type {
	OnboardingStackParamList,
	RootStackParamList,
} from './navigation/NavigationModels';
import { RouteNames } from './navigation/NavigationModels';
import { ArticleWrapper } from './navigation/navigators/article';
import { EditionsMenuScreen } from './screens/editions-menu-screen';
import { HomeScreen } from './screens/home-screen';
import { AuthSwitcherScreen } from './screens/identity-login-screen';
import { IssueScreen } from './screens/issue-screen';
import { LightboxScreen } from './screens/lightbox';
import { OnboardingConsentScreen } from './screens/onboarding-screen';
import { SettingsScreen } from './screens/settings-screen';
import { AlreadySubscribedScreen } from './screens/settings/already-subscribed-screen';
import { ApiScreen } from './screens/settings/api-screen';
import { BetaProgrammeFAQsScreen } from './screens/settings/beta-programme-faqs';
import { CasSignInScreen } from './screens/settings/cas-sign-in-screen';
import { CreditsScreen } from './screens/settings/credits-screen';
import { EditionsScreen } from './screens/settings/editions-screen';
import { FAQScreen } from './screens/settings/faq-screen';
import {
	GdprConsentScreen,
	GdprConsentScreenForOnboarding,
} from './screens/settings/gdpr-consent-screen';
import { HelpScreen } from './screens/settings/help-screen';
import { ManageEditionsScreenWithHeader } from './screens/settings/manage-editions-screen';
import {
	PrivacyPolicyScreen,
	PrivacyPolicyScreenForOnboarding,
} from './screens/settings/privacy-policy-screen';
import { SubscriptionDetailsScreen } from './screens/settings/subscription-details-screen';
import { TermsAndConditionsScreen } from './screens/settings/terms-and-conditions-screen';
import { WeatherGeolocationConsentScreen } from './screens/weather-geolocation-consent-screen';

const Stack = createStackNavigator<RootStackParamList>();

const { multiply } = Animated;

const cardStyleInterpolator = (props: any) => {
	const translateX = multiply(
		props.current.progress.interpolate({
			inputRange: [0, 1],
			outputRange: [props.layouts.screen.width, 0],
			extrapolate: 'clamp',
		}),
		props.inverted,
	);

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
	};
};

const Onboarding = createStackNavigator<OnboardingStackParamList>();

const OnboardingStack = () => {
	return (
		<Onboarding.Navigator>
			<Onboarding.Screen
				name={RouteNames.OnboardingConsent}
				component={OnboardingConsentScreen}
			/>
			<Onboarding.Screen
				name={RouteNames.OnboardingConsentInline}
				component={GdprConsentScreenForOnboarding}
			/>
			<Onboarding.Screen
				name={RouteNames.PrivacyPolicyInline}
				component={PrivacyPolicyScreenForOnboarding}
			/>
		</Onboarding.Navigator>
	);
};

const RootStack = () => {
	return (
		<Stack.Navigator
			initialRouteName={RouteNames.Home}
			screenOptions={{ gestureEnabled: false, headerShown: false }}
		>
			<Stack.Screen
				name={RouteNames.Issue}
				component={IssueScreen}
				options={{}}
			/>
			<Stack.Screen
				name={RouteNames.IssueList}
				component={HomeScreen}
				options={{
					gestureDirection: 'horizontal',
					cardStyle: { backgroundColor: 'transparent' },
					cardOverlayEnabled: true,
					cardStyleInterpolator,
				}}
			/>
			<Stack.Screen
				name={RouteNames.EditionsMenu}
				component={EditionsMenuScreen}
				options={{
					gestureDirection: 'horizontal-inverted',
					cardStyle: { backgroundColor: 'transparent' },
					cardOverlayEnabled: true,
					cardStyleInterpolator,
				}}
			/>
			<Stack.Screen
				name={RouteNames.Article}
				component={ArticleWrapper}
				options={{
					cardStyleInterpolator:
						CardStyleInterpolators.forModalPresentationIOS,
					gestureEnabled: true,
					gestureDirection: 'vertical',
				}}
			/>
			<Stack.Screen
				name={RouteNames.Settings}
				component={SettingsScreen}
			/>
			<Stack.Screen
				name={RouteNames.SignIn}
				component={AuthSwitcherScreen}
			/>
			<Stack.Screen
				name={RouteNames.AlreadySubscribed}
				component={AlreadySubscribedScreen}
			/>
			<Stack.Screen
				name={RouteNames.CasSignIn}
				component={CasSignInScreen}
			/>
			<Stack.Screen
				name={RouteNames.ManageEditionsSettings}
				component={ManageEditionsScreenWithHeader}
			/>
			{/** @TODO Fix the enable all button */}
			<Stack.Screen
				name={RouteNames.GdprConsent}
				component={GdprConsentScreen}
			/>
			<Stack.Screen
				name={RouteNames.PrivacyPolicy}
				component={PrivacyPolicyScreen}
			/>
			<Stack.Screen
				name={RouteNames.Lightbox}
				component={LightboxScreen}
			/>
			{/* ==== Inspect from here === */}
			<Stack.Screen
				name={RouteNames.Edition}
				component={EditionsScreen}
			/>
			<Stack.Screen
				name={RouteNames.TermsAndConditions}
				component={TermsAndConditionsScreen}
			/>
			<Stack.Screen
				name={RouteNames.BetaProgrammeFAQs}
				component={BetaProgrammeFAQsScreen}
			/>
			<Stack.Screen name={RouteNames.Help} component={HelpScreen} />
			<Stack.Screen name={RouteNames.Credits} component={CreditsScreen} />
			<Stack.Screen name={RouteNames.FAQ} component={FAQScreen} />
			<Stack.Screen
				name={RouteNames.SubscriptionDetails}
				component={SubscriptionDetailsScreen}
			/>
			<Stack.Screen name={RouteNames.Endpoints} component={ApiScreen} />
			{/* Turned off to remove Promise rejection error on Android */}
			{/* <Stack.Screen
                name={RouteNames.Storybook}
                component={StorybookScreen}
            /> */}

			<Stack.Screen
				name={RouteNames.WeatherGeolocationConsent}
				component={WeatherGeolocationConsentScreen}
			/>
		</Stack.Navigator>
	);
};

const ONBOARDING_QUERY = gql(`{
    gdprAllowEssential @client
    gdprAllowPerformance @client
    gdprAllowFunctionality @client
    gdprConsentVersion @client
}`);

type OnboardingQueryData = {
	gdprAllowEssential: boolean;
	gdprAllowPerformance: boolean;
	gdprAllowFunctionality: boolean;
	gdprConsentVersion: number;
};

const hasOnboarded = (data: OnboardingQueryData) =>
	data.gdprAllowEssential != null &&
	data.gdprAllowFunctionality != null &&
	data.gdprAllowPerformance != null &&
	data.gdprConsentVersion == CURRENT_CONSENT_VERSION;

const AppNavigation = () => {
	const [isOnboarded, setIsOnboarded] = useState(true);
	const query = useQuery<OnboardingQueryData>(ONBOARDING_QUERY);
	useEffect(() => {
		/** Setting is still loading, do nothing yet. */
		if (query.loading) return;
		const { data } = query;
		// If any flag is unknown still, we want to onboard.
		// We expected people to give explicit yay/nay to
		// each GDPR bucket.
		if (!data || !hasOnboarded(data)) {
			setIsOnboarded(false);
		} else {
			setIsOnboarded(true);
			console.log(isOnboarded, 'onboarded');
		}
	});
	return (
		<NavigationContainer>
			{isOnboarded ? <RootStack /> : <OnboardingStack />}
		</NavigationContainer>
	);
};

export { AppNavigation };
