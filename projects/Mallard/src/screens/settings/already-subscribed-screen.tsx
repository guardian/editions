import { useNavigation } from '@react-navigation/native';
import type { NativeStackNavigationProp } from '@react-navigation/native-stack';
import React, { useContext, useState } from 'react';
import { ActivityIndicator, Platform } from 'react-native';
import { AccessContext, useAccess } from 'src/authentication/AccessContext';
import { isError, isValid } from 'src/authentication/lib/Attempt';
import { HeaderScreenContainer } from 'src/components/Header/Header';
import { RightChevron } from 'src/components/icons/RightChevron';
import { ScrollContainer } from 'src/components/layout/ui/container';
import { Heading } from 'src/components/layout/ui/row';
import { List } from 'src/components/lists/list';
import { copy } from 'src/helpers/words';
import { useOkta } from 'src/hooks/use-okta-sign-in';
import type { MainStackParamList } from 'src/navigation/NavigationModels';
import { RouteNames } from 'src/navigation/NavigationModels';
import { WithAppAppearance } from 'src/theme/appearance';

const AlreadySubscribedScreen = () => {
	const [loading, setLoading] = useState(false);
	const canAccess = useAccess();
	const { authIAP } = useContext(AccessContext);
	const rightChevronIcon = <RightChevron />;
	const activityIndicator = <ActivityIndicator />;
	const navigation =
		useNavigation<NativeStackNavigationProp<MainStackParamList>>();
	const { signIn } = useOkta();

	return (
		<HeaderScreenContainer
			title={copy.alreadySubscribed.title}
			actionLeft={true}
		>
			<WithAppAppearance value={'settings'}>
				<ScrollContainer>
					<Heading>
						{copy.alreadySubscribed.subscriptionHeading}
					</Heading>
					<List
						data={
							!canAccess
								? [
										{
											key: 'Sign in to activate',
											title: copy.alreadySubscribed
												.signInTitle,
											onPress: signIn,
											proxy: rightChevronIcon,
											linkWeight: 'regular',
										},
										{
											key: 'Activate with subscriber ID',
											title: copy.alreadySubscribed
												.subscriberIdTitle,
											onPress: () => {
												navigation.navigate(
													RouteNames.CasSignIn,
												);
											},
											proxy: rightChevronIcon,
											linkWeight: 'regular',
										},
								  ]
								: []
						}
					/>
					{Platform.OS === 'ios' ? (
						<>
							<Heading>{``}</Heading>
							<Heading>
								{copy.alreadySubscribed.appHeading}
							</Heading>
							<List
								data={[
									{
										key: 'Restore App Store subscription',
										title: copy.alreadySubscribed
											.restoreIapTitle,
										onPress: async () => {
											setLoading(true);
											const { accessAttempt } =
												await authIAP();
											if (isValid(accessAttempt)) {
												setLoading(false);
												navigation.navigate(
													RouteNames.SubFoundModal,
													{
														closeAction: () =>
															navigation.navigate(
																RouteNames.Issue,
															),
													},
												);
											} else if (isError(accessAttempt)) {
												setLoading(false);
												navigation.navigate(
													RouteNames.MissingIAPRestoreError,
												);
											} else {
												setLoading(false);
												navigation.navigate(
													RouteNames.MissingIAPRestoreMissing,
												);
											}
										},
										proxy: loading
											? activityIndicator
											: rightChevronIcon,
										linkWeight: 'regular',
									},
								]}
							/>
						</>
					) : (
						<></>
					)}
				</ScrollContainer>
			</WithAppAppearance>
		</HeaderScreenContainer>
	);
};

export { AlreadySubscribedScreen };
