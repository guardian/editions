import React, { useContext, useState, useEffect } from 'react'
import { Text } from 'react-native'
import { AccessContext } from 'src/authentication/AccessContext'
import { isValid } from 'src/authentication/lib/Attempt'
import { ScrollContainer } from 'src/components/layout/ui/container'
import { WithAppAppearance } from 'src/theme/appearance'
import { List } from 'src/components/lists/list'
import { IdentityAuthData } from 'src/authentication/authorizers/IdentityAuthorizer'
import { CASExpiry } from '../../../../Apps/common/src/cas-expiry'
import { Heading } from 'src/components/layout/ui/row'
import { ReceiptIOS } from 'src/authentication/services/iap'
import { Copy } from 'src/helpers/words'
import { fetchEditionMenuEnabledSetting } from 'src/helpers/settings/debug'

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
        <Heading>{Copy.subscriptionDetails.heading}</Heading>
        <List
            data={[
                keyValueItem(
                    Copy.subscriptionDetails.emailAddress,
                    identityData.userDetails.primaryEmailAddress,
                ),
                keyValueItem(
                    Copy.subscriptionDetails.userId,
                    identityData.membershipData.userId,
                ),
            ]}
        />
    </>
)

const casCodePrettyLabels: { [key: string]: string } = {
    SevenDay: 'Guardian / Observer',
}

const getCASType = (casData: CASExpiry) =>
    casCodePrettyLabels[casData.subscriptionCode] || casData.subscriptionCode

const CASDetails = ({ casData }: { casData: CASExpiry }) => (
    <>
        <Heading>{Copy.subscriptionDetails.heading}</Heading>
        <List
            data={[
                keyValueItem(
                    Copy.subscriptionDetails.subscriptionType,
                    getCASType(casData),
                ),
                keyValueItem(
                    Copy.subscriptionDetails.expiryDate,
                    casData.expiryDate,
                ),
                keyValueItem(
                    Copy.subscriptionDetails.subscriptionPrefix,
                    casData.provider,
                ),
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

const IAPDetails = ({ iapData }: { iapData: ReceiptIOS }) => {
    const [editionsMenuEnabled, setEditionsMenuEnabled] = useState(false)
    useEffect(() => {
        fetchEditionMenuEnabledSetting().then((editionsMenuToggle: boolean) => {
            setEditionsMenuEnabled(editionsMenuToggle)
        })
    }, [])
    return (
        <>
            <Heading>
                {editionsMenuEnabled
                    ? Copy.subscriptionDetails.iapHeadingEditions
                    : Copy.subscriptionDetails.iapHeadingDaily}
            </Heading>
            <List
                data={[
                    keyValueItem('Subscription type', getIAPType(iapData)),
                    keyValueItem(
                        'Purchase date',
                        iapData.original_purchase_date,
                    ),
                    keyValueItem('Expiry date', iapData.expires_date),
                ]}
            />
        </>
    )
}

const LoggedOutDetails = () => (
    <Heading>{Copy.subscriptionDetails.loggedOutHeading}</Heading>
)

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
    title: (
        <Text style={{ fontSize: 20 }}>{Copy.subscriptionDetails.title}</Text>
    ),
}

export { SubscriptionDetailsScreen }
