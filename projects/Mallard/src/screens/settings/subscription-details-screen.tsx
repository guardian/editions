import React, { useContext } from 'react';
import { Text } from 'react-native';
import { AccessContext } from 'src/authentication/AccessContext';
import type { IdentityAuthData } from 'src/authentication/authorizers/IdentityAuthorizer';
import { isValid } from 'src/authentication/lib/Attempt';
import type { ReceiptIOS } from 'src/authentication/services/iap';
import { HeaderScreenContainer } from 'src/components/Header/Header';
import { ScrollContainer } from 'src/components/layout/ui/container';
import { Heading } from 'src/components/layout/ui/row';
import { List } from 'src/components/lists/list';
import { copy } from 'src/helpers/words';
import { WithAppAppearance } from 'src/theme/appearance';
import type { CASExpiry } from '../../../../Apps/common/src/cas-expiry';

const keyValueItem = (key: string, value: string) =>
	({
		title: key,
		key,
		linkWeight: 'regular',
		proxy: <Text>{value}</Text>,
	} as const);

const IdentityDetails = ({
	identityData,
}: {
	identityData: IdentityAuthData;
}) => (
	<>
		<List
			data={[
				keyValueItem(
					copy.subscriptionDetails.emailAddress,
					identityData.userDetails.primaryEmailAddress,
				),
				keyValueItem(
					copy.subscriptionDetails.userId,
					identityData.membershipData.userId,
				),
			]}
		/>
	</>
);

const OktaDetails = ({ oktaData }: { oktaData: any }) => (
	<>
		<List
			data={[
				keyValueItem(
					copy.subscriptionDetails.emailAddress,
					oktaData.userDetails.preferred_username,
				),
				keyValueItem(
					copy.subscriptionDetails.userId,
					oktaData.membershipDetails.userId,
				),
			]}
		/>
	</>
);

const casCodePrettyLabels: Record<string, string> = {
	SevenDay: 'Guardian / Observer',
};

const getCASType = (casData: CASExpiry) =>
	casCodePrettyLabels[casData.subscriptionCode] || casData.subscriptionCode;

const CASDetails = ({ casData }: { casData: CASExpiry }) => (
	<>
		<List
			data={[
				keyValueItem(
					copy.subscriptionDetails.subscriptionType,
					getCASType(casData),
				),
				keyValueItem(
					copy.subscriptionDetails.expiryDate,
					casData.expiryDate,
				),
				keyValueItem(
					copy.subscriptionDetails.subscriptionPrefix,
					casData.provider,
				),
			]}
		/>
	</>
);

const productIdPrettyLabels: Record<string, string> = {
	'uk.co.guardian.gce.1monthsub2': 'Guardian Subscription',
	'uk.co.guardian.gce.observer.1monthsub2': 'Observer Subscription',
	'uk.co.guardian.gce.plusobserver.1monthsub': 'Seven Day Subscription',
	'uk.co.guardian.gce.sevenday.1monthsub2': 'Seven Day Subscription',
};

const getIAPType = (iapData: ReceiptIOS) =>
	(productIdPrettyLabels[iapData.product_id] || iapData.name) ?? 'Unknown';

const IAPDetails = ({ iapData }: { iapData: ReceiptIOS }) => (
	<>
		<List
			data={[
				keyValueItem('Subscription type', getIAPType(iapData)),
				keyValueItem('Purchase date', iapData.original_purchase_date),
				keyValueItem('Expiry date', iapData.expires_date),
			]}
		/>
	</>
);

const LoggedOutDetails = () => (
	<Heading>{copy.subscriptionDetails.loggedOutHeading}</Heading>
);

const SubscriptionDetailsScreen = () => {
	const { identityData, oktaData, iapData, casData, attempt } =
		useContext(AccessContext);

	return (
		<HeaderScreenContainer
			title={copy.subscriptionDetails.title}
			actionLeft={true}
		>
			<WithAppAppearance value={'settings'}>
				<ScrollContainer>
					{(() => {
						const attemptType = isValid(attempt)
							? attempt.data
							: null;
						if (!attemptType) return <LoggedOutDetails />;
						switch (attemptType) {
							case 'cas':
								return (
									casData && <CASDetails casData={casData} />
								);
							case 'iap':
								return (
									iapData && <IAPDetails iapData={iapData} />
								);
							case 'identity':
								return (
									identityData && (
										<IdentityDetails
											identityData={identityData}
										/>
									)
								);
							case 'okta':
								return (
									oktaData && (
										<OktaDetails oktaData={oktaData} />
									)
								);
						}
					})()}
				</ScrollContainer>
			</WithAppAppearance>
		</HeaderScreenContainer>
	);
};

export { SubscriptionDetailsScreen };
