import { useNavigation } from '@react-navigation/native';
import type { StackNavigationProp } from '@react-navigation/stack';
import React, { useContext, useState } from 'react';
import type { AccessibilityRole } from 'react-native';
import { Alert, Linking, Platform, Switch, Text } from 'react-native';
import DeviceInfo from 'react-native-device-info';
import {
	AccessContext,
	useAccess,
	useIdentity,
} from 'src/authentication/AccessContext';
import { isStaffMember } from 'src/authentication/helpers';
import { oktaSignOut } from 'src/authentication/services/okta';
import { HeaderScreenContainer } from 'src/components/Header/Header';
import { RightChevron } from 'src/components/icons/RightChevron';
import { ScrollContainer } from 'src/components/layout/ui/container';
import { Heading, Row, Separator } from 'src/components/layout/ui/row';
import { DualButton } from 'src/components/lists/DualButton';
import { FullButton } from 'src/components/lists/FullButton';
import { logEvent } from 'src/helpers/analytics';
import { Copy } from 'src/helpers/words';
import {
	useIsUsingProdDevtools,
	useNotificationsEnabled,
} from 'src/hooks/use-config-provider';
import { useOkta } from 'src/hooks/use-okta-sign-in';
import { useIsWeatherShown } from 'src/hooks/use-weather-provider';
import type { SettingsStackParamList } from 'src/navigation/NavigationModels';
import { RouteNames } from 'src/navigation/NavigationModels';
import { BetaButtonOption } from 'src/screens/settings/join-beta-button';
import { WithAppAppearance } from 'src/theme/appearance';

const MiscSettingsList = () => {
	const navigation =
		useNavigation<StackNavigationProp<SettingsStackParamList>>();
	const { notificationsEnabled, setNotifications } =
		useNotificationsEnabled();
	const [settingNotificationsEnabled, setSettingNotificationsEnabled] =
		useState(notificationsEnabled);

	const { isWeatherShown, setIsWeatherShown } = useIsWeatherShown();
	// Allows for a smooth switch change and persistance is dealt with after
	const [componentlIsWeatherShown, setcomponentlIsWeatherShown] =
		useState(isWeatherShown);
	const onWeatherChange = () => {
		setcomponentlIsWeatherShown(!isWeatherShown);
		setIsWeatherShown(!isWeatherShown);
		logEvent({
			name: 'toggle_weather',
			value: (!isWeatherShown).toString(),
		});
	};

	const onNotificationChange = () => {
		const setting = !settingNotificationsEnabled;
		setSettingNotificationsEnabled(setting);
		setNotifications(setting);
	};

	const androidItems = [
		{
			key: 'notificationEnabled',
			title: Copy.settings.notifications,
			proxy: (
				<Switch
					accessible={true}
					accessibilityLabel={Copy.settings.notifications}
					accessibilityRole="switch"
					value={settingNotificationsEnabled}
					onValueChange={onNotificationChange}
				/>
			),
		},
	];

	const items = [
		{
			key: 'isWeatherShown',
			title: Copy.settings.displayWeather,
			proxy: (
				<Switch
					accessible={true}
					accessibilityLabel={Copy.settings.displayWeather}
					accessibilityRole="switch"
					value={componentlIsWeatherShown}
					onValueChange={onWeatherChange}
				/>
			),
		},
		{
			key: 'manageEditions',
			title: Copy.settings.manageDownloads,
			onPress: () => navigation.navigate(RouteNames.ManageEditions),
			proxy: <RightChevron />,
		},
	];

	const data =
		Platform.OS === 'android' ? [...androidItems, ...items] : items;

	return (
		<>
			{data.map((item) => (
				<>
					<Row {...item} />
					<Separator />
				</>
			))}
		</>
	);
};

const SignInButton = ({
	username,
	signOut,
	signIn,
	accessible = true,
	accessibilityRole = 'button',
}: {
	username?: string;
	signOut: () => void;
	signIn: () => void;
	accessible: boolean;
	accessibilityRole: AccessibilityRole;
}) =>
	username ? (
		<DualButton
			accessible={accessible}
			accessibilityRole={accessibilityRole}
			textPrimary={username}
			textSecondary={Copy.settings.signOut}
			onPressPrimary={() =>
				Linking.openURL(
					'https://manage.theguardian.com/account-settings',
				).catch(() => {
					signOut();
				})
			}
			onPressSecondary={() => {
				signOut();
			}}
		/>
	) : (
		<FullButton
			accessible={true}
			accessibilityRole={accessibilityRole}
			text={Copy.settings.signIn}
			onPress={signIn}
		/>
	);

const SettingsScreen = () => {
	const navigation = useNavigation();
	const identityData = useIdentity();
	const canAccess = useAccess();
	const [, setVersionClickedTimes] = useState(0);
	const { iapData } = useContext(AccessContext);
	const { signIn, signOut } = useOkta();

	const versionNumber = DeviceInfo.getVersion();
	// This gets affected, should look to centralise some of this for better abstraction
	const isLoggedInWithIdentity = identityData
		? identityData.userDetails.preferred_username
		: false;

	const canDisplayBetaButton = !iapData && isLoggedInWithIdentity;
	const buildNumber = DeviceInfo.getBuildNumber();
	const { isUsingProdDevtools, setIsUsingProdDevTools } =
		useIsUsingProdDevtools();

	const versionClickHandler = identityData
		? () => {
				if (!isUsingProdDevtools && isStaffMember(identityData))
					setVersionClickedTimes((t) => {
						if (t < 7) return t + 1;
						Alert.alert(
							'Enable Developer Mode',
							'Are you sure?',
							[
								{
									text: 'Enable',
									style: 'destructive',
									onPress: () => {
										setIsUsingProdDevTools(true);
									},
								},
								{
									text: 'Cancel',
									style: 'cancel',
									onPress: () => {},
								},
							],
							{ cancelable: false },
						);
						return 0;
					});
		  }
		: () => {};

	const rightChevronIcon = <RightChevron />;

	return (
		<HeaderScreenContainer title="Settings" actionLeft={true}>
			<WithAppAppearance value={'settings'}>
				<ScrollContainer>
					<SignInButton
						accessible={true}
						accessibilityRole="button"
						username={
							// This will be affected
							identityData
								? identityData.userDetails.preferred_username
								: undefined
						}
						signIn={signIn}
						signOut={signOut}
					/>
					<Separator />
					{canAccess ? (
						<Row
							title={Copy.settings.subscriptionDetails}
							onPress={() =>
								navigation.navigate(
									RouteNames.SubscriptionDetails,
								)
							}
							proxy={rightChevronIcon}
						/>
					) : (
						<Row
							title={Copy.settings.alreadySubscribed}
							onPress={() =>
								navigation.navigate(
									RouteNames.AlreadySubscribed,
								)
							}
							proxy={rightChevronIcon}
						/>
					)}
					<Separator />
					<Heading>{``}</Heading>
					<Separator />
					<MiscSettingsList />
					<Heading>{``}</Heading>
					<Separator />
					<Row
						title={Copy.settings.privacySettings}
						onPress={() =>
							navigation.navigate(RouteNames.GdprConsent)
						}
						proxy={rightChevronIcon}
					/>
					<Separator />
					<Row
						title={Copy.settings.privacyPolicy}
						onPress={() =>
							navigation.navigate(RouteNames.PrivacyPolicy)
						}
						proxy={rightChevronIcon}
					/>
					<Separator />
					<Row
						title={Copy.settings.termsAndConditions}
						onPress={() =>
							navigation.navigate(RouteNames.TermsAndConditions)
						}
						proxy={rightChevronIcon}
					/>
					<Separator />
					<Heading>{``}</Heading>
					<Separator />
					<Row
						title={Copy.settings.help}
						onPress={() => navigation.navigate(RouteNames.Help)}
						proxy={rightChevronIcon}
					/>
					<Separator />
					<Row
						title={Copy.settings.credits}
						onPress={() => navigation.navigate(RouteNames.Credits)}
						proxy={rightChevronIcon}
					/>
					<Separator />
					<Row
						title={Copy.settings.version}
						onPress={versionClickHandler}
						proxy={
							<Text>
								{versionNumber} ({buildNumber})
							</Text>
						}
					/>
					<Separator />
					<Heading>{``}</Heading>
					{canDisplayBetaButton && <BetaButtonOption />}
					{isUsingProdDevtools && (
						<>
							<Separator />

							<Row
								title="Developer Menu"
								onPress={() =>
									navigation.navigate(RouteNames.DevZone)
								}
								proxy={rightChevronIcon}
							/>
						</>
					)}
				</ScrollContainer>
			</WithAppAppearance>
		</HeaderScreenContainer>
	);
};

export { SettingsScreen };
