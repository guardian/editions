import { useNavigation } from '@react-navigation/native';
import React, { useContext } from 'react';
import { AccessContext } from 'src/authentication/AccessContext';
import { HeaderScreenContainer } from 'src/components/Header/Header';
import { RightChevron } from 'src/components/icons/RightChevron';
import { ScrollContainer } from 'src/components/layout/ui/container';
import { Heading } from 'src/components/layout/ui/row';
import { List } from 'src/components/lists/list';
import {
	copyDiagnosticInfo,
	createSupportMailto,
} from 'src/helpers/diagnostics';
import {
	APPS_FEEDBACK_EMAIL,
	DIAGNOSTICS_TITLE,
	HELP_HEADER_TITLE,
	ISSUE_EMAIL,
	READERS_EMAIL,
	SUBSCRIPTION_EMAIL,
} from 'src/helpers/words';
import { useNetInfoProvider } from 'src/hooks/use-net-info-provider';
import { useToast } from 'src/hooks/use-toast';
import { RouteNames } from 'src/navigation/NavigationModels';
import { WithAppAppearance } from 'src/theme/appearance';

export interface OnCompletionToast {
	(msg: string): void;
}

const HelpScreen = () => {
	const navigation = useNavigation();
	const { showToast } = useToast();
	const { attempt } = useContext(AccessContext);

	const showToastCallback: OnCompletionToast = (msg: string) => {
		showToast(msg);
	};
	const {
		isConnected,
		isPoorConnection,
		type,
		downloadBlocked,
		isInternetReachable,
	} = useNetInfoProvider();
	const netInfo = {
		isConnected,
		isPoorConnection,
		type,
		downloadBlocked,
		isInternetReachable,
	};

	return (
		<HeaderScreenContainer title={HELP_HEADER_TITLE} actionLeft={true}>
			<WithAppAppearance value={'settings'}>
				<ScrollContainer>
					<List
						data={[
							{
								key: 'Frequently Asked Questions',
								title: 'Frequently Asked Questions',
								onPress: () => {
									navigation.navigate(RouteNames.FAQ);
								},
								proxy: <RightChevron />,
							},
						]}
					/>
					<Heading>Contact us</Heading>
					<List
						data={[
							createSupportMailto(
								'Report an issue',
								ISSUE_EMAIL,
								attempt,
								netInfo,
								DIAGNOSTICS_TITLE,
							),
							createSupportMailto(
								'Subscription, payment and billing issues',
								SUBSCRIPTION_EMAIL,
								attempt,
								netInfo,
							),
							createSupportMailto(
								'Comment or query about an article',
								READERS_EMAIL,
								attempt,
								netInfo,
							),
							createSupportMailto(
								'Send feedback',
								APPS_FEEDBACK_EMAIL,
								attempt,
								netInfo,
							),
						]}
					/>
					<Heading>Diagnostics</Heading>
					<List
						data={[
							copyDiagnosticInfo(
								'Copy diagnostic information',
								attempt,
								netInfo,
								showToastCallback,
							),
						]}
					/>
				</ScrollContainer>
			</WithAppAppearance>
		</HeaderScreenContainer>
	);
};

export { HelpScreen };
