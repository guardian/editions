import { useNavigation } from '@react-navigation/native';
import type { NativeStackNavigationProp } from '@react-navigation/native-stack';
import React, { useContext, useState } from 'react';
import type { AccessibilityRole } from 'react-native';
import { Alert, Linking, Platform, Switch, Text } from 'react-native';
import DeviceInfo from 'react-native-device-info';
import {
	AccessContext,
	useAccess,
	useIdentity,
	useOktaData,
} from '../authentication/AccessContext';
import { isStaffMemberOkta } from '../authentication/helpers';
import { HeaderScreenContainer } from '../components/Header/Header';
import { RightChevron } from '../components/icons/RightChevron';
import { ScrollContainer } from '../components/layout/ui/container';
import { Heading, Row, Separator } from '../components/layout/ui/row';
import { DualButton } from '../components/lists/DualButton';
import { FullButton } from '../components/lists/FullButton';
import { logEvent } from '../helpers/analytics';
import { copy } from '../helpers/words';
import {
	useIsUsingProdDevtools,
	useNotificationsEnabled,
} from '../hooks/use-config-provider';
import { useOkta } from '../hooks/use-okta-sign-in';
import { useIsWeatherShown } from '../hooks/use-weather-provider';
import type { MainStackParamList } from '../navigation/NavigationModels';
import { RouteNames } from '../navigation/NavigationModels';
import { BetaButtonOption } from '../screens/settings/join-beta-button';
import { WithAppAppearance } from '../theme/appearance';

const MiscSettingsList = () => {
	const navigation =
		useNavigation<NativeStackNavigationProp<MainStackParamList>>();
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
			title: copy.settings.notifications,
			proxy: (
				<Switch
					accessible={true}
					accessibilityLabel={copy.settings.notifications}
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
			title: copy.settings.displayWeather,
			proxy: (
				<Switch
					accessible={true}
					accessibilityLabel={copy.settings.displayWeather}
					accessibilityRole="switch"
					value={componentlIsWeatherShown}
					onValueChange={onWeatherChange}
				/>
			),
		},
		{
			key: 'manageEditions',
			title: copy.settings.manageDownloads,
			onPress: () =>
				navigation.navigate(RouteNames.ManageEditionsFromSettings),
			proxy: <RightChevron />,
		},
	];

	const data =
		Platform.OS === 'android' ? [...androidItems, ...items] : items;

	return (
		<>
			{data.map((item, index) => (
				<>
					<Row {...item} key={index} />
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
			textSecondary={copy.settings.signOut}
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
			text={copy.settings.signIn}
			onPress={signIn}
		/>
	);

const SettingsScreen = () => {
	const navigation =
		useNavigation<NativeStackNavigationProp<MainStackParamList>>();
	const identityData = useIdentity();
	const oktaData = useOktaData();
	const canAccess = useAccess();
	const [, setVersionClickedTimes] = useState(0);
	const { iapData, signOutIdentity } = useContext(AccessContext);
	const { signIn, signOut } = useOkta();

	const versionNumber = DeviceInfo.getVersion();
	const isLoggedInWithOkta = oktaData
		? oktaData.userDetails.preferred_username
		: false;
	const isLoggedInWithIdentity = identityData
		? identityData.userDetails.primaryEmailAddress
		: false;

	const canDisplayBetaButton =
		!iapData && (isLoggedInWithOkta || isLoggedInWithIdentity);
	const buildNumber = DeviceInfo.getBuildNumber();
	const { isUsingProdDevtools, setIsUsingProdDevTools } =
		useIsUsingProdDevtools();

	const versionClickHandler = oktaData
		? () => {
				if (!isUsingProdDevtools && isStaffMemberOkta(oktaData)) {
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
			}
		: () => {};

	const rightChevronIcon = <RightChevron />;

	const username = () => {
		if (identityData) {
			return identityData.userDetails.primaryEmailAddress;
		} else if (oktaData) {
			return oktaData.userDetails.preferred_username;
		} else {
			return undefined;
		}
	};

	return (
		<HeaderScreenContainer title="Settings" actionLeft={true}>
			<WithAppAppearance value={'settings'}>
				<ScrollContainer>
					<SignInButton
						accessible={true}
						accessibilityRole="button"
						username={username()}
						signIn={signIn}
						signOut={() => {
							signOut();
							signOutIdentity();
						}}
					/>
					<Separator />
					{canAccess ? (
						<Row
							title={copy.settings.subscriptionDetails}
							onPress={() =>
								navigation.navigate(
									RouteNames.SubscriptionDetails,
								)
							}
							proxy={rightChevronIcon}
						/>
					) : (
						<Row
							title={copy.settings.alreadySubscribed}
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
						title={copy.settings.privacySettings}
						onPress={() =>
							navigation.navigate(RouteNames.GdprConsent)
						}
						proxy={rightChevronIcon}
					/>
					<Separator />
					<Row
						title={copy.settings.privacyPolicy}
						onPress={() =>
							navigation.navigate(RouteNames.PrivacyPolicy)
						}
						proxy={rightChevronIcon}
					/>
					<Separator />
					<Row
						title={copy.settings.termsAndConditions}
						onPress={() =>
							navigation.navigate(RouteNames.TermsAndConditions)
						}
						proxy={rightChevronIcon}
					/>
					<Separator />
					<Heading>{``}</Heading>
					<Separator />
					<Row
						title={copy.settings.help}
						onPress={() => navigation.navigate(RouteNames.Help)}
						proxy={rightChevronIcon}
					/>
					<Separator />
					<Row
						title={copy.settings.version}
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
