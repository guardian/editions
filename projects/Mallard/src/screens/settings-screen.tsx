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
import { HeaderScreenContainer } from 'src/components/Header/Header';
import { RightChevron } from 'src/components/icons/RightChevron';
import { ScrollContainer } from 'src/components/layout/ui/container';
import { Heading, Row, Separator } from 'src/components/layout/ui/row';
import { DualButton } from 'src/components/lists/DualButton';
import { FullButton } from 'src/components/lists/FullButton';
import { Copy } from 'src/helpers/words';
import {
	useIsUsingProdDevtools,
	useNotificationsEnabled,
} from 'src/hooks/use-config-provider';
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
	signOutIdentity,
	accessible = true,
	accessibilityRole = 'button',
}: {
	username?: string;
	signOutIdentity: () => void;
	accessible: boolean;
	accessibilityRole: AccessibilityRole;
}) => {
	const navigation = useNavigation();
	return username ? (
		<DualButton
			accessible={accessible}
			accessibilityRole={accessibilityRole}
			textPrimary={username}
			textSecondary={Copy.settings.signOut}
			onPressPrimary={() =>
				Linking.openURL(
					'https://manage.theguardian.com/account-settings',
				).catch(() => signOutIdentity())
			}
			onPressSecondary={() => signOutIdentity()}
		/>
	) : (
		<FullButton
			accessible={true}
			accessibilityRole={accessibilityRole}
			text={Copy.settings.signIn}
			onPress={() => navigation.navigate(RouteNames.SignIn)}
		/>
	);
};

const SettingsScreen = () => {
	const navigation = useNavigation();
	const identityData = useIdentity();
	const canAccess = useAccess();
	const [, setVersionClickedTimes] = useState(0);
	const { signOutIdentity, iapData } = useContext(AccessContext);

	const versionNumber = DeviceInfo.getVersion();
	const isLoggedInWithIdentity = identityData
		? identityData.userDetails.primaryEmailAddress
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
							identityData
								? identityData.userDetails.primaryEmailAddress
								: undefined
						}
						signOutIdentity={signOutIdentity}
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
