import { useApolloClient } from '@apollo/react-hooks';
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
	const client = useApolloClient();

	const showToastCallback: OnCompletionToast = (msg: string) => {
		showToast(msg);
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
								client,
								'Report an issue',
								ISSUE_EMAIL,
								attempt,
								DIAGNOSTICS_TITLE,
							),
							createSupportMailto(
								client,
								'Subscription, payment and billing issues',
								SUBSCRIPTION_EMAIL,
								attempt,
							),
							createSupportMailto(
								client,
								'Comment or query about an article',
								READERS_EMAIL,
								attempt,
							),
							createSupportMailto(
								client,
								'Send feedback',
								APPS_FEEDBACK_EMAIL,
								attempt,
							),
						]}
					/>
					<Heading>Diagnostics</Heading>
					<List
						data={[
							copyDiagnosticInfo(
								client,
								'Copy diagnostic information',
								attempt,
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
