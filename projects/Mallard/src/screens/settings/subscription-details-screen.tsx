import React, { useContext } from 'react'
import { Text } from 'react-native'
import { AccessContext } from 'src/authentication/AccessContext'
import { isValid } from 'src/authentication/lib/Attempt'
import { ScrollContainer } from 'src/components/layout/ui/container'
import { WithAppAppearance } from 'src/theme/appearance'
import { List } from 'src/components/lists/list'
import { IdentityAuthData } from 'src/authentication/authorizers/IdentityAuthorizer'
import { CasExpiry } from 'src/services/content-auth-service'
import { Heading } from 'src/components/layout/ui/row'
import { ReceiptIOS } from 'src/authentication/services/iap'

const keyValueItem = (key: string, value: string) =>
    ({
        title: key,
        key,
        linkWeight: 'regular',
        proxy: <Text>{value}</Text>,
    } as const)

const IdentityDetails = ({
    identityData,
}: {
    identityData: IdentityAuthData
}) => (
    <>
        <Heading>Paper + digital subscription</Heading>
        <List
            onPress={() => {}}
            data={[
                keyValueItem(
                    'Display name',
                    identityData.userDetails.publicFields.displayName,
                ),
                keyValueItem('User ID', identityData.membershipData.userId),
            ]}
        />
    </>
)

const casCodePrettyLabels: { [key: string]: string } = {
    SevenDay: 'Guardian / Observer',
}

const getCASType = (casData: CasExpiry) =>
    casCodePrettyLabels[casData.subscriptionCode] || casData.subscriptionCode

const CASDetails = ({ casData }: { casData: CasExpiry }) => (
    <>
        <Heading>Paper + digital subscription</Heading>
        <List
            onPress={() => {}}
            data={[
                keyValueItem('Subscription type', getCASType(casData)),
                keyValueItem('Expiry date', casData.expiryDate),
                keyValueItem('Subscription prefix', casData.provider),
            ]}
        />
    </>
)

const productIdPrettyLabels: { [key: string]: string } = {
    'uk.co.guardian.gce.1monthsub2': 'Guardian Subscription',
    'uk.co.guardian.gce.observer.1monthsub2': 'Observer Subscription',
    'uk.co.guardian.gce.plusobserver.1monthsub': 'Seven Day Subscription',
    'uk.co.guardian.gce.sevenday.1monthsub2': 'Seven Day Subscription',
}

const getIAPType = (iapData: ReceiptIOS) =>
    productIdPrettyLabels[iapData.product_id] || iapData.name || 'Unknown'

const IAPDetails = ({ iapData }: { iapData: ReceiptIOS }) => (
    <>
        <Heading>Guardian Daily / App Store</Heading>
        <List
            onPress={() => {}}
            data={[
                keyValueItem('Subscription type', getIAPType(iapData)),
                keyValueItem('Purchase date', iapData.original_purchase_date),
                keyValueItem('Expiry date', iapData.expires_date),
            ]}
        />
    </>
)

const LoggedOutDetails = () => <Heading>Not logged in</Heading>

const SubscriptionDetailsScreen = () => {
    const { identityData, iapData, casData, attempt } = useContext(
        AccessContext,
    )

    return (
        <WithAppAppearance value={'settings'}>
            <ScrollContainer>
                {(() => {
                    const attemptType = isValid(attempt) ? attempt.data : null
                    if (!attemptType) return <LoggedOutDetails />
                    switch (attemptType) {
                        case 'cas':
                            return casData && <CASDetails casData={casData} />
                        case 'iap':
                            return iapData && <IAPDetails iapData={iapData} />
                        case 'identity':
                            return (
                                identityData && (
                                    <IdentityDetails
                                        identityData={identityData}
                                    />
                                )
                            )
                    }
                })()}
            </ScrollContainer>
        </WithAppAppearance>
    )
}

SubscriptionDetailsScreen.navigationOptions = {
    title: <Text style={{ fontSize: 20 }}>Subscription Details</Text>,
}

export { SubscriptionDetailsScreen }
