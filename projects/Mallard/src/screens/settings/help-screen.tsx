import { useNavigation } from '@react-navigation/native';
import React, { useContext } from 'react';
import { AccessContext } from 'src/authentication/AccessContext';
import { HeaderScreenContainer } from 'src/components/Header/Header';
import { RightChevron } from 'src/components/icons/RightChevron';
import { ScrollContainer } from 'src/components/layout/ui/container';
import { Heading, Row, Separator } from 'src/components/layout/ui/row';
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
import { useGdprSettings } from 'src/hooks/use-gdpr';
import { useNetInfo } from 'src/hooks/use-net-info-provider';
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
	} = useNetInfo();
	const netInfo = {
		isConnected,
		isPoorConnection,
		type,
		downloadBlocked,
		isInternetReachable,
	};
	const {
		gdprAllowEssential,
		gdprAllowPerformance,
		gdprAllowFunctionality,
		gdprConsentVersion,
	} = useGdprSettings();
	const gdprSettings = {
		gdprAllowEssential,
		gdprAllowPerformance,
		gdprAllowFunctionality,
		gdprConsentVersion,
	};

	return (
		<HeaderScreenContainer title={HELP_HEADER_TITLE} actionLeft={true}>
			<WithAppAppearance value={'settings'}>
				<ScrollContainer>
					<Row
						title="Frequently Asked Questions"
						onPress={() => navigation.navigate(RouteNames.FAQ)}
						proxy={<RightChevron />}
					/>
					<Separator />

					<Heading>Contact us</Heading>
					<Separator />
					<Row
						{...createSupportMailto(
							'Report an issue',
							ISSUE_EMAIL,
							attempt,
							netInfo,
							gdprSettings,
							DIAGNOSTICS_TITLE,
						)}
					/>
					<Separator />
					<Row
						{...createSupportMailto(
							'Subscription, payment and billing issues',
							SUBSCRIPTION_EMAIL,
							attempt,
							netInfo,
							gdprSettings,
						)}
					/>
					<Separator />
					<Row
						{...createSupportMailto(
							'Comment or query about an article',
							READERS_EMAIL,
							attempt,
							netInfo,
							gdprSettings,
						)}
					/>
					<Separator />
					<Row
						{...createSupportMailto(
							'Send feedback',
							APPS_FEEDBACK_EMAIL,
							attempt,
							netInfo,
							gdprSettings,
						)}
					/>
					<Separator />

					<Heading>Diagnostics</Heading>
					<Separator />
					<Row
						{...copyDiagnosticInfo(
							'Copy diagnostic information',
							attempt,
							netInfo,
							gdprSettings,
							showToastCallback,
						)}
					/>
					<Separator />
				</ScrollContainer>
			</WithAppAppearance>
		</HeaderScreenContainer>
	);
};

export { HelpScreen };
