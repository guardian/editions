import { useNavigation } from '@react-navigation/native';
import type { NativeStackNavigationProp } from '@react-navigation/native-stack';
import React from 'react';
import { Alert, FlatList, Text, View } from 'react-native';
import { Button, ButtonAppearance } from 'src/components/Button/Button';
import { HeaderScreenContainer } from 'src/components/Header/Header';
import { Footer, Separator, TallRow } from 'src/components/layout/ui/row';
import type { ThreeWaySwitchValue } from 'src/components/layout/ui/switch';
import { ThreeWaySwitch } from 'src/components/layout/ui/switch';
import { LinkNav } from 'src/components/link';
import { LoginHeader } from 'src/components/login/login-layout';
import { Spacer } from 'src/components/Spacer/Spacer';
import { UiBodyCopy } from 'src/components/styled-text';
import { logEvent } from 'src/helpers/analytics';
import {
	copy,
	PREFS_SAVED_MSG,
	PRIVACY_SETTINGS_HEADER_TITLE,
} from 'src/helpers/words';
import type { GdprSwitches } from 'src/hooks/use-gdpr';
import { OnboardingStatus, useGdprSettings } from 'src/hooks/use-gdpr';
import { useToast } from 'src/hooks/use-toast';
import type { MainStackParamList } from 'src/navigation/NavigationModels';
import { RouteNames } from 'src/navigation/NavigationModels';
import { WithAppAppearance } from 'src/theme/appearance';

interface GdprSwitch {
	name: string;
	services: string;
	description: string;
	modifier: (value: ThreeWaySwitchValue) => void;
	value: ThreeWaySwitchValue;
}
type EssentialGdprSwitch = Omit<GdprSwitch, 'key' | 'modifier' | 'value'>;

const essentials: EssentialGdprSwitch = {
	name: 'Essential',
	services:
		'YouTube Player - Firebase Cloud Messaging - Firebase Remote Config',
	description:
		'These are essential to provide you with services that you have requested. These services support the ability for you to watch videos, see service-related messages, download content automatically and receive new features without app releases.',
};

const GdprConsent = ({
	shouldShowDismissableHeader = false,
	withContinue = false,
}: {
	shouldShowDismissableHeader?: boolean;
	withContinue?: boolean;
}) => {
	const navigation =
		useNavigation<NativeStackNavigationProp<MainStackParamList>>();
	const { showToast } = useToast();

	const routes = navigation.getState()?.routes;
	// -2 because -1 is the current route
	const prevRoute = routes[routes.length - 2];

	const {
		enableAllSettings,
		rejectAllSettings,
		resetAllSettings,
		gdprAllowPerformance,
		gdprAllowFunctionality,
		setGdprPerformanceBucket,
		setGdprFunctionalityBucket,
		hasSetGdpr,
		isCorrectConsentVersion,
	} = useGdprSettings();

	const switches: { [key in keyof GdprSwitches]: GdprSwitch } = {
		gdprAllowPerformance: {
			name: 'Performance',
			services: 'Sentry - Crashlytics',
			description:
				'Enabling these allow us to observe and measure how you use our services. We use this information to fix bugs more quickly so that users have a better experience. For example, we would be able to see the journey you have taken and where the error was encountered. Your data will only be stored in our servers for two weeks. If you disable this, we will not be able to observe and measure your use of our services, and we will have less information about their performance and details of any issues encountered.',
			modifier: setGdprPerformanceBucket,
			value: gdprAllowPerformance,
		},
		gdprAllowFunctionality: {
			name: 'Functionality',
			services: 'Apple - Google',
			description:
				'Enabling these allow us to provide extra sign-in functionality. It enables us to offer alternative options for you to sign-in to your Guardian account using your Apple or Google credentials. If you disable this, you won’t be able to sign-in with the third-party services above.',
			modifier: setGdprFunctionalityBucket,
			value: gdprAllowFunctionality,
		},
	};

	const onEnableAllAndContinue = () => {
		enableAllSettings();
		showToast(PREFS_SAVED_MSG);
		withContinue && navigation.navigate(RouteNames.Issue);
	};

	const onRejectAllAndContinue = () => {
		rejectAllSettings();
		showToast(PREFS_SAVED_MSG);
		withContinue && navigation.navigate(RouteNames.Issue);
	};

	const continueText = withContinue
		? `${copy.enableAll} ${copy.andContinue}`
		: copy.enableAll;

	const rejectText = withContinue
		? `${copy.rejectAll} ${copy.andContinue}`
		: copy.rejectAll;

	const onDismiss = () => {
		if (hasSetGdpr() === OnboardingStatus.Complete) {
			navigation.navigate(RouteNames.Issue);
			showToast(PREFS_SAVED_MSG);
		} else {
			Alert.alert(
				'Before you go',
				`Please set your preferences for 'Performance' and 'Functionality'.`,
				[
					{ text: 'Manage preferences', onPress: () => {} },
					{
						text: continueText,
						onPress: () => onEnableAllAndContinue(),
					},
				],
				{ cancelable: false },
			);
		}
	};

	return (
		<View style={{ flex: 1, backgroundColor: 'white' }}>
			{shouldShowDismissableHeader && (
				<LoginHeader onDismiss={() => onDismiss()}>
					{PRIVACY_SETTINGS_HEADER_TITLE}
				</LoginHeader>
			)}
			<FlatList
				showsVerticalScrollIndicator={false}
				ListHeaderComponent={() => (
					<>
						<TallRow
							title={''}
							explainer={
								<Text>
									Below you can manage your privacy settings
									for cookies and similar technologies for
									this service. These technologies are
									provided by us and by our third-party
									partners. To find out more, read our{' '}
									<LinkNav
										onPress={() =>
											navigation.navigate(
												RouteNames.PrivacyPolicyInline,
											)
										}
									>
										privacy policy
									</LinkNav>
									. If you disable a category, you may need to
									restart the app for your changes to fully
									take effect.
								</Text>
							}
							proxy={
								<>
									<Button
										appearance={ButtonAppearance.Skeleton}
										onPress={() => {
											onEnableAllAndContinue();
											logEvent({
												name: 'gdpr_enable_all',
												value: 'gdpr_enable_all',
											});
										}}
									>
										{continueText}
									</Button>
									<Spacer />
									<Button
										appearance={ButtonAppearance.Skeleton}
										onPress={() => {
											onRejectAllAndContinue();
											logEvent({
												name: 'gdpr_reject_all',
												value: 'gdpr_reject_all',
											});
										}}
									>
										{rejectText}
									</Button>
								</>
							}
						></TallRow>
						<Separator></Separator>
						<TallRow
							title={essentials.name}
							subtitle={essentials.services}
							explainer={essentials.description}
						></TallRow>
						<Separator></Separator>
					</>
				)}
				ListFooterComponent={() => (
					<>
						<Separator></Separator>
						{prevRoute.name !== RouteNames.Settings && (
							<Footer>
								<UiBodyCopy
									weight="bold"
									style={{ fontSize: 14 }}
								>
									You can change the above settings any time
									by selecting Privacy Settings from the
									Settings menu.
								</UiBodyCopy>
							</Footer>
						)}

						<Footer>
							{__DEV__ && (
								<Button
									onPress={() => {
										resetAllSettings();
										logEvent({
											name: 'gdpr_reset_all',
											value: 'gdpr_reset_all',
										});
									}}
								>
									Reset
								</Button>
							)}
							<Button onPress={onDismiss}>Save</Button>
						</Footer>
					</>
				)}
				ItemSeparatorComponent={Separator}
				data={Object.values(switches)}
				keyExtractor={({ name }) => name}
				renderItem={({
					item: { name, services, description, modifier, value },
				}) => {
					return (
						<TallRow
							title={name}
							subtitle={services}
							explainer={description}
							proxy={
								<ThreeWaySwitch
									onValueChange={(value) => {
										modifier(value);
										logEvent({
											name: `gdpr_${name.toLowerCase()}`,
											value: value?.toString() ?? 'null',
										});
									}}
									value={
										isCorrectConsentVersion() ? value : null
									}
								/>
							}
						></TallRow>
					);
				}}
			/>
		</View>
	);
};

const GdprConsentScreen = () => (
	<HeaderScreenContainer
		title={PRIVACY_SETTINGS_HEADER_TITLE}
		actionLeft={true}
	>
		<WithAppAppearance value={'settings'}>
			<GdprConsent />
		</WithAppAppearance>
	</HeaderScreenContainer>
);

const GdprConsentScreenForOnboarding = () => (
	<WithAppAppearance value={'settings'}>
		<GdprConsent
			shouldShowDismissableHeader={true}
			withContinue
		></GdprConsent>
	</WithAppAppearance>
);

export { GdprConsentScreen, GdprConsentScreenForOnboarding };
