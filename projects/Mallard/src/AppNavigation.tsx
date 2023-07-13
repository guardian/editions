import { NavigationContainer } from '@react-navigation/native';
import type { NavigationContainerRef } from '@react-navigation/native';
import type { StackCardInterpolationProps } from '@react-navigation/stack';
import {
	CardStyleInterpolators,
	createStackNavigator,
	TransitionPresets,
} from '@react-navigation/stack';
import React, { useRef } from 'react';
import { Animated } from 'react-native';
import { isTablet } from 'react-native-device-info';
import { LoadingScreen } from './components/LoadingScreen/LoadingScreen';
import {
	MissingIAPRestoreError,
	MissingIAPRestoreMissing,
} from './components/Modals/MissingIAPModal';
import { SignInFailedModal } from './components/Modals/SignInFailedModal';
import { SignInModal } from './components/Modals/SignInModal';
import { SubFoundModalCard } from './components/Modals/SubFoundModal';
import { SubNotFoundModal } from './components/Modals/SubNotFoundModal';
import { logScreenView } from './helpers/analytics';
import { useIsOnboarded } from './hooks/use-onboarding';
import type {
	MainStackParamList,
	OnboardingStackParamList,
	RootStackParamList,
	SettingsStackParamList,
} from './navigation/NavigationModels';
import { RouteNames } from './navigation/NavigationModels';
import { ArticleWrapper } from './navigation/navigators/article';
import { EditionsMenuScreen } from './screens/editions-menu-screen';
import { ExternalSubscriptionScreen } from './screens/external-subscription';
import { HomeScreen } from './screens/home-screen';
import { AuthSwitcherScreen } from './screens/identity-login-screen';
import { InAppPurchaseScreen } from './screens/in-app-purchase-screen';
import { IssueScreen } from './screens/issue-screen';
import { LightboxScreen } from './screens/lightbox';
import { OnboardingConsentScreen } from './screens/onboarding-screen';
import { AlreadySubscribedScreen } from './screens/settings/already-subscribed-screen';
import { ApiScreen } from './screens/settings/api-screen';
import { BetaProgrammeFAQsScreen } from './screens/settings/beta-programme-faqs';
import { CasSignInScreen } from './screens/settings/cas-sign-in-screen';
import { CreditsScreen } from './screens/settings/credits-screen';
import { DevZone } from './screens/settings/dev-zone';
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
import { SettingsScreen } from './screens/settings-screen';
import { WeatherGeolocationConsentScreen } from './screens/weather-geolocation-consent-screen';
import { color } from './theme/color';

const { multiply } = Animated;

const forFade = ({ current }: StackCardInterpolationProps) => ({
	cardStyle: {
		opacity: current.progress,
	},
});

const forFadeOnArticleScreen = ({
	current,
	insets,
}: StackCardInterpolationProps) => ({
	cardStyle: {
		opacity: current.progress,
		paddingTop: insets.top + 10,
	},
});

const cardStyleInterpolator = (props: StackCardInterpolationProps) => {
	const translateX = multiply(
		props.current.progress.interpolate({
			inputRange: [0, 1],
			outputRange: [props.layouts.screen.width, 0],
			extrapolate: 'clamp',
		}),
		props.inverted,
	);

	return {
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
const Root = createStackNavigator<RootStackParamList>();
const Settings = createStackNavigator<SettingsStackParamList>();
const Main = createStackNavigator<MainStackParamList>();

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

const MainStack = () => {
	return (
		<Main.Navigator
			initialRouteName={RouteNames.Home}
			screenOptions={{
				cardStyle: { backgroundColor: color.background },
				gestureEnabled: false,
				headerShown: false,
			}}
		>
			<Main.Screen
				name={RouteNames.Issue}
				component={IssueScreen}
				options={{}}
			/>
			<Main.Screen
				name={RouteNames.Crossword}
				component={ArticleWrapper}
				options={{
					...TransitionPresets.ModalSlideFromBottomIOS,
				}}
			/>
			<Main.Screen
				name={RouteNames.IssueList}
				component={HomeScreen}
				options={{
					gestureDirection: 'horizontal',
					cardStyle: { backgroundColor: 'transparent' },
					cardOverlayEnabled: true,
					cardStyleInterpolator,
				}}
			/>
			<Main.Screen
				name={RouteNames.EditionsMenu}
				component={EditionsMenuScreen}
				options={{
					gestureDirection: 'horizontal-inverted',
					cardStyle: { backgroundColor: 'transparent' },
					cardOverlayEnabled: true,
					cardStyleInterpolator,
				}}
			/>
			<Main.Screen
				name={RouteNames.Article}
				component={ArticleWrapper}
				options={{
					cardStyleInterpolator:
						CardStyleInterpolators.forModalPresentationIOS,
					gestureEnabled: true,
					gestureDirection: 'vertical',
				}}
			/>

			<Main.Screen
				name={RouteNames.Lightbox}
				component={LightboxScreen}
				options={{
					...TransitionPresets.ModalSlideFromBottomIOS,
				}}
			/>
			<Main.Screen
				name={RouteNames.ExternalSubscription}
				component={ExternalSubscriptionScreen}
				options={
					isTablet()
						? {
								cardStyle: {
									backgroundColor: 'rgba(0,0,0,0.6)',
								},
								cardStyleInterpolator: forFadeOnArticleScreen,
						  }
						: {
								cardStyleInterpolator:
									CardStyleInterpolators.forModalPresentationIOS,
								gestureEnabled: true,
								gestureDirection: 'vertical',
						  }
				}
			/>
			<Main.Screen
				name={RouteNames.SubNotFoundModal}
				component={SubNotFoundModal}
				options={{
					cardStyleInterpolator: forFadeOnArticleScreen,
					cardStyle: {
						backgroundColor: 'rgba(0,0,0,0.8)',
					},
				}}
			/>
			<Main.Screen
				name={RouteNames.SignInModal}
				component={SignInModal}
				options={{
					cardStyleInterpolator: forFadeOnArticleScreen,
					cardStyle: {
						backgroundColor: 'rgba(0,0,0,0.6)',
					},
				}}
			/>
			<Main.Screen
				name={RouteNames.SubFoundModal}
				component={SubFoundModalCard}
				options={{
					cardStyleInterpolator: forFade,
					cardStyle: {
						backgroundColor: 'rgba(0,0,0,0.8)',
					},
				}}
			/>
			<Main.Screen
				name={RouteNames.SignInFailedModal}
				component={SignInFailedModal}
				options={{
					cardStyleInterpolator: forFade,
					cardStyle: {
						backgroundColor: 'rgba(0,0,0,0.8)',
					},
				}}
			/>

			<Main.Screen
				name={RouteNames.MissingIAPRestoreError}
				component={MissingIAPRestoreError}
				options={{
					cardStyleInterpolator: forFade,
					cardStyle: {
						backgroundColor: 'rgba(0,0,0,0.8)',
					},
				}}
			/>

			<Main.Screen
				name={RouteNames.MissingIAPRestoreMissing}
				component={MissingIAPRestoreMissing}
				options={{
					cardStyleInterpolator: forFade,
					cardStyle: {
						backgroundColor: 'rgba(0,0,0,0.8)',
					},
				}}
			/>
		</Main.Navigator>
	);
};

const SettingsStack = () => {
	return (
		<Settings.Navigator
			initialRouteName={RouteNames.Settings}
			screenOptions={{
				gestureEnabled: false,
				headerShown: false,
				cardStyle: { backgroundColor: 'transparent' },
				cardOverlayEnabled: true,
				animationEnabled: false,
			}}
		>
			<Settings.Screen
				name={RouteNames.Settings}
				component={SettingsScreen}
			/>
			<Settings.Screen
				name={RouteNames.TermsAndConditions}
				component={TermsAndConditionsScreen}
			/>
			<Settings.Screen
				name={RouteNames.SubscriptionDetails}
				component={SubscriptionDetailsScreen}
			/>
			<Settings.Screen
				name={RouteNames.AlreadySubscribed}
				component={AlreadySubscribedScreen}
			/>
			<Settings.Screen
				name={RouteNames.AlreadySubscribedOverlay}
				component={AlreadySubscribedScreen}
				options={{
					cardStyleInterpolator: forFade,
					cardStyle: {
						backgroundColor: 'rgba(0,0,0,0.8)',
					},
				}}
			/>

			<Settings.Screen
				name={RouteNames.GdprConsent}
				component={GdprConsentScreen}
			/>
			<Settings.Screen
				name={RouteNames.PrivacyPolicy}
				component={PrivacyPolicyScreen}
			/>
			<Settings.Screen
				name={RouteNames.ManageEditions}
				component={ManageEditionsScreen}
				options={{
					gestureDirection: 'vertical',
				}}
			/>
			<Settings.Screen
				name={RouteNames.Endpoints}
				component={ApiScreen}
			/>
			<Settings.Screen
				name={RouteNames.Credits}
				component={CreditsScreen}
			/>
			<Settings.Screen
				name={RouteNames.BetaProgrammeFAQs}
				component={BetaProgrammeFAQsScreen}
			/>
			<Settings.Screen
				name={RouteNames.Edition}
				component={EditionsScreen}
			/>
			<Settings.Screen
				name={RouteNames.CasSignIn}
				component={CasSignInScreen}
			/>
			<Settings.Screen
				name={RouteNames.WeatherGeolocationConsent}
				component={WeatherGeolocationConsentScreen}
			/>
			<Settings.Screen
				name={RouteNames.SignIn}
				component={AuthSwitcherScreen}
			/>
			<Settings.Screen name={RouteNames.Help} component={HelpScreen} />
			<Settings.Screen name={RouteNames.FAQ} component={FAQScreen} />
			<Settings.Screen name={RouteNames.DevZone} component={DevZone} />
			<Settings.Screen
				name={RouteNames.InAppPurchase}
				component={InAppPurchaseScreen}
			/>
		</Settings.Navigator>
	);
};

const RootStack = () => {
	return (
		<Root.Navigator
			mode="modal"
			screenOptions={{
				headerShown: false,
				cardStyle: { backgroundColor: 'transparent' },
				cardOverlayEnabled: true,
				...TransitionPresets.ModalSlideFromBottomIOS,
			}}
		>
			<Root.Screen
				name={RouteNames.Home}
				component={MainStack}
				options={{
					headerShown: false,
				}}
			/>
			<Root.Screen
				name={RouteNames.Settings}
				component={SettingsStack}
				options={{
					headerShown: false,
				}}
			/>
		</Root.Navigator>
	);
};

const AppNavigation = () => {
	const { isOnboarded, isLoading } = useIsOnboarded();
	// Designed to stop a screen flash as effects are resolving
	const routeNameRef = useRef<any>();
	const navigationRef = useRef<NavigationContainerRef | null>(null);
	return (
		<NavigationContainer
			ref={navigationRef}
			onReady={() => {
				routeNameRef.current =
					navigationRef.current?.getCurrentRoute()?.name;
			}}
			onStateChange={async () => {
				const previousRouteName = routeNameRef.current;
				const currentRouteName =
					navigationRef.current?.getCurrentRoute()?.name;

				if (previousRouteName !== currentRouteName) {
					currentRouteName && (await logScreenView(currentRouteName));
				}
				routeNameRef.current = currentRouteName;
			}}
		>
			{isLoading ? (
				<LoadingScreen />
			) : isOnboarded ? (
				<RootStack />
			) : (
				<OnboardingStack />
			)}
		</NavigationContainer>
	);
};

export { AppNavigation };
