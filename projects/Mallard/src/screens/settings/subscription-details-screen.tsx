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

const IdentityDetails = ({
    identityData,
}: {
    identityData: IdentityAuthData
}) => (
    <>
        <Heading>Guardian: Digital pack</Heading>
        <List
            onPress={() => {}}
            data={[
                {
                    title: 'Name',
                    key: 'Name',
                    explainer:
                        identityData.userDetails.publicFields.displayName,
                },
                {
                    title: 'User ID',
                    key: 'User ID',
                    explainer: identityData.membershipData.userId,
                },
            ]}
        />
    </>
)

const CASDetails = ({ casData }: { casData: CasExpiry }) => (
    <>
        <Heading>Subscription</Heading>
        <List
            onPress={() => {}}
            data={[
                {
                    title: 'Subscription type',
                    key: 'Subscription type',
                    explainer: casData.provider,
                },
                {
                    title: 'Subscription code',
                    key: 'Subscription code',
                    explainer: casData.subscriptionCode,
                },
                {
                    title: 'Expiry date',
                    key: 'Expiry date',
                    explainer: casData.expiryDate,
                },
            ]}
        />
    </>
)

const IAPDetails = ({ iapData }: { iapData: ReceiptIOS }) => (
    <>
        <Heading>In-app Purchase</Heading>
        <List
            onPress={() => {}}
            data={[
                {
                    title: 'Purchase date',
                    key: 'Purchase date',
                    explainer: iapData.original_purchase_date,
                },
                {
                    title: 'Expiry date',
                    key: 'Expiry date',
                    explainer: iapData.expires_date,
                },
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
