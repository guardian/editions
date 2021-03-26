import { useNavigation } from '@react-navigation/native';
import type { StackNavigationProp } from '@react-navigation/stack';
import type ApolloClient from 'apollo-client';
import gql from 'graphql-tag';
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
import { Heading } from 'src/components/layout/ui/row';
import { DualButton } from 'src/components/lists/DualButton';
import { FullButton } from 'src/components/lists/FullButton';
import { List } from 'src/components/lists/list';
import {
	setIsUsingProdDevtools,
	setIsWeatherShown,
} from 'src/helpers/settings/setters';
import { Copy } from 'src/helpers/words';
import { useQuery } from 'src/hooks/apollo';
import { useNotificationsEnabled } from 'src/hooks/use-config-provider';
import type { RootStackParamList } from 'src/navigation/NavigationModels';
import { RouteNames } from 'src/navigation/NavigationModels';
import { BetaButtonOption } from 'src/screens/settings/join-beta-button';
import { WithAppAppearance } from 'src/theme/appearance';
import { DevZone } from './settings/dev-zone';

const MiscSettingsList = React.memo(
	(props: { isWeatherShown: boolean; client: ApolloClient<object> }) => {
		const navigation = useNavigation<
			StackNavigationProp<RootStackParamList>
		>();
		const {
			notificationsEnabled,
			setNotifications,
		} = useNotificationsEnabled();
		const [
			settingNotificationsEnabled,
			setSettingNotificationsEnabled,
		] = useState(notificationsEnabled);

		const onWeatherChange = () =>
			setIsWeatherShown(props.client, !props.isWeatherShown);

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
						value={props.isWeatherShown}
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

		return <List data={data} />;
	},
);

type QueryData = { isWeatherShown: boolean; isUsingProdDevtools: boolean };

const QUERY = gql`
	{
		isWeatherShown @client
		isUsingProdDevtools @client
	}
`;

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
	const query = useQuery<QueryData>(QUERY);
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

	if (query.loading) return null;
	const { client } = query;
	const { isUsingProdDevtools, isWeatherShown } = query.data;

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
										setIsUsingProdDevtools(client, true);
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

	const signInListItems = [
		...(canAccess
			? [
					{
						key: 'Subscription details',
						title: Copy.settings.subscriptionDetails,
						onPress: () => {
							navigation.navigate(RouteNames.SubscriptionDetails);
						},
						proxy: rightChevronIcon,
					},
			  ]
			: [
					{
						key: `I'm already subscribed`,
						title: Copy.settings.alreadySubscribed,
						onPress: () => {
							navigation.navigate(RouteNames.AlreadySubscribed);
						},
						proxy: rightChevronIcon,
					},
			  ]),
	];

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
					<List data={signInListItems} />
					<Heading>{``}</Heading>
					<MiscSettingsList
						client={client}
						isWeatherShown={isWeatherShown}
					/>
					<Heading>{``}</Heading>
					<List
						data={[
							{
								key: 'Privacy settings',
								title: Copy.settings.privacySettings,
								proxy: rightChevronIcon,
								onPress: () => {
									navigation.navigate(RouteNames.GdprConsent);
								},
							},
							{
								key: 'Privacy policy',
								title: Copy.settings.privacyPolicy,
								proxy: rightChevronIcon,
								onPress: () => {
									navigation.navigate(
										RouteNames.PrivacyPolicy,
									);
								},
							},
							{
								key: 'Terms and conditions',
								title: Copy.settings.termsAndConditions,
								onPress: () => {
									navigation.navigate(
										RouteNames.TermsAndConditions,
									);
								},
								proxy: rightChevronIcon,
							},
						]}
					/>
					<Heading>{``}</Heading>
					<List
						data={[
							{
								key: 'Help',
								title: Copy.settings.help,
								onPress: () => {
									navigation.navigate(RouteNames.Help);
								},
								proxy: rightChevronIcon,
							},
							{
								key: 'Credits',
								title: Copy.settings.credits,
								onPress: () => {
									navigation.navigate(RouteNames.Credits);
								},
								proxy: rightChevronIcon,
							},
							{
								key: 'Version',
								title: Copy.settings.version,
								onPress: versionClickHandler,
								proxy: (
									<Text>
										{versionNumber} ({buildNumber})
									</Text>
								),
							},
						]}
					/>
					{canDisplayBetaButton && <BetaButtonOption />}
					{isUsingProdDevtools && <DevZone />}
				</ScrollContainer>
			</WithAppAppearance>
		</HeaderScreenContainer>
	);
};

export { SettingsScreen };
