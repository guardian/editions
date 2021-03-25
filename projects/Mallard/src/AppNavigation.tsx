import { NavigationContainer } from '@react-navigation/native';
import {
	CardStyleInterpolators,
	createStackNavigator,
} from '@react-navigation/stack';
import React from 'react';
import { Animated } from 'react-native';
import { useIsOnboarded } from './navigation/helpers/onboarding';
import type {
	MainStackParamList,
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
import { ManageEditionsScreen } from './screens/settings/manage-editions-screen';
import {
	PrivacyPolicyScreen,
	PrivacyPolicyScreenForOnboarding,
} from './screens/settings/privacy-policy-screen';
import { SubscriptionDetailsScreen } from './screens/settings/subscription-details-screen';
import { TermsAndConditionsScreen } from './screens/settings/terms-and-conditions-screen';
import { WeatherGeolocationConsentScreen } from './screens/weather-geolocation-consent-screen';

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
const RootStack = createStackNavigator<RootStackParamList>();
const MainStack = createStackNavigator<MainStackParamList>();

const OnboardingStack = () => {
	return (
		<Onboarding.Navigator
			initialRouteName={RouteNames.OnboardingConsent}
			screenOptions={{ gestureEnabled: false, headerShown: false }}
		>
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

const MainStackScreen = () => {
	return (
		<MainStack.Navigator
			initialRouteName={RouteNames.Home}
			screenOptions={{ gestureEnabled: false, headerShown: false }}
		>
			<MainStack.Screen
				name={RouteNames.Issue}
				component={IssueScreen}
				options={{}}
			/>
			<MainStack.Screen
				name={RouteNames.IssueList}
				component={HomeScreen}
				options={{
					gestureDirection: 'horizontal',
					cardStyle: { backgroundColor: 'transparent' },
					cardOverlayEnabled: true,
					cardStyleInterpolator,
				}}
			/>
			<MainStack.Screen
				name={RouteNames.EditionsMenu}
				component={EditionsMenuScreen}
				options={{
					gestureDirection: 'horizontal-inverted',
					cardStyle: { backgroundColor: 'transparent' },
					cardOverlayEnabled: true,
					cardStyleInterpolator,
				}}
			/>
			<MainStack.Screen
				name={RouteNames.Article}
				component={ArticleWrapper}
				options={{
					cardStyleInterpolator:
						CardStyleInterpolators.forModalPresentationIOS,
					gestureEnabled: true,
					gestureDirection: 'vertical',
				}}
			/>
			<MainStack.Screen
				name={RouteNames.SignIn}
				component={AuthSwitcherScreen}
			/>

			{/* Turned off to remove Promise rejection error on Android */}
			{/* <MainStack.Screen
                name={RouteNames.Storybook}
                component={StorybookScreen}
            /> */}
			<MainStack.Screen
				name={RouteNames.WeatherGeolocationConsent}
				component={WeatherGeolocationConsentScreen}
			/>
			<MainStack.Screen
				name={RouteNames.Lightbox}
				component={LightboxScreen}
			/>
		</MainStack.Navigator>
	);
};

function RootStackScreen() {
	return (
		<RootStack.Navigator
			mode="modal"
			screenOptions={{
				headerShown: false,
				cardStyle: { backgroundColor: 'transparent' },
				cardOverlayEnabled: true,
				cardStyleInterpolator: ({ current: { progress } }) => ({
					cardStyle: {
						opacity: progress.interpolate({
							inputRange: [0, 0.5, 0.9, 1],
							outputRange: [0, 0.25, 0.7, 1],
						}),
					},
					overlayStyle: {
						opacity: progress.interpolate({
							inputRange: [0, 1],
							outputRange: [0, 0.5],
							extrapolate: 'clamp',
						}),
					},
				}),
			}}
		>
			<RootStack.Screen
				name={RouteNames.Home}
				component={MainStackScreen}
				options={{ headerShown: false }}
			/>
			<RootStack.Screen
				name={RouteNames.Settings}
				component={SettingsScreen}
				options={{ headerShown: false }}
			/>
			<RootStack.Screen
				name={RouteNames.TermsAndConditions}
				component={TermsAndConditionsScreen}
				options={{ headerShown: false }}
			/>
			<RootStack.Screen
				name={RouteNames.SubscriptionDetails}
				component={SubscriptionDetailsScreen}
			/>
			<RootStack.Screen
				name={RouteNames.AlreadySubscribed}
				component={AlreadySubscribedScreen}
			/>
			<RootStack.Screen
				name={RouteNames.GdprConsent}
				component={GdprConsentScreen}
			/>
			<RootStack.Screen
				name={RouteNames.PrivacyPolicy}
				component={PrivacyPolicyScreen}
			/>
			<RootStack.Screen
				name={RouteNames.ManageEditions}
				component={ManageEditionsScreen}
			/>
			<RootStack.Screen
				name={RouteNames.Endpoints}
				component={ApiScreen}
			/>
			<RootStack.Screen
				name={RouteNames.Credits}
				component={CreditsScreen}
			/>
			<RootStack.Screen
				name={RouteNames.BetaProgrammeFAQs}
				component={BetaProgrammeFAQsScreen}
			/>
			<RootStack.Screen
				name={RouteNames.Edition}
				component={EditionsScreen}
			/>
			<RootStack.Screen
				name={RouteNames.CasSignIn}
				component={CasSignInScreen}
			/>
			<RootStack.Screen name={RouteNames.Help} component={HelpScreen} />
			<RootStack.Screen name={RouteNames.FAQ} component={FAQScreen} />
		</RootStack.Navigator>
	);
}

const AppNavigation = () => {
	const { isOnboarded } = useIsOnboarded();

	return (
		<NavigationContainer>
			{isOnboarded ? <RootStackScreen /> : <OnboardingStack />}
		</NavigationContainer>
	);
};

export { AppNavigation };
