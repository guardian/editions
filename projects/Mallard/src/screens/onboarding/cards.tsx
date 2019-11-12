import React from 'react'
import { StyleSheet, View } from 'react-native'
import {
    OnboardingCard,
    CardAppearance,
} from 'src/components/onboarding/onboarding-card'
import { ButtonAppearance } from 'src/components/button/button'
import { ModalButton } from 'src/components/modal-button'
import { LinkNav } from 'src/components/link'
import { gdprSwitchSettings } from 'src/helpers/settings'
import { GDPR_SETTINGS_FRAGMENT } from 'src/helpers/settings/resolvers'
import { setGdprFlag } from 'src/helpers/settings/setters'
import { useQuery, QueryStatus } from 'src/hooks/apollo'
import gql from 'graphql-tag'

const Aligner = ({ children }: { children: React.ReactNode }) => (
    <View
        style={{
            flexDirection: 'column',
            flex: 1,
            alignItems: 'stretch',
            justifyContent: 'center',
        }}
    >
        {children}
    </View>
)

const styles = StyleSheet.create({
    consentButtonContainer: {
        display: 'flex',
        flexDirection: 'row',
        alignItems: 'center',
    },
})

const QUERY = gql(`{ ${GDPR_SETTINGS_FRAGMENT} }`)

const OnboardingConsent = ({
    onOpenGdprConsent,
    onContinue,
    onOpenPrivacyPolicy,
}: {
    onOpenGdprConsent: () => void
    onContinue: () => void
    onOpenPrivacyPolicy: () => void
}) => {
    const query = useQuery<{ [key: string]: boolean | null }>(QUERY)
    if (query.loading) return null
    const { data, client } = query

    const enableNulls = () => {
        gdprSwitchSettings.map(sw => {
            if (data[sw] === null) {
                setGdprFlag(client, sw, true)
            }
        })
    }

    return (
        <Aligner>
            <OnboardingCard
                appearance={CardAppearance.blue}
                title="We care about your privacy"
                explainerTitle="This app is free of ads"
                bottomExplainerContent={
                    <>
                        <View style={styles.consentButtonContainer}>
                            <View>
                                <ModalButton
                                    onPress={() => {
                                        onOpenGdprConsent()
                                    }}
                                    buttonAppearance={
                                        ButtonAppearance.skeletonBlue
                                    }
                                >
                                    My options
                                </ModalButton>
                            </View>
                            <View>
                                <ModalButton
                                    onPress={() => {
                                        enableNulls()
                                        onContinue()
                                    }}
                                    buttonAppearance={ButtonAppearance.dark}
                                >
                                    {`I'm okay with that`}
                                </ModalButton>
                            </View>
                        </View>
                    </>
                }
            >
                {
                    <>
                        The only data that is collected (through tracking
                        technology) is used by the Guardian to improve your
                        experience and our level of service to you. By
                        continuing, you agree with the Guardian&apos;s{' '}
                        <LinkNav onPress={onOpenPrivacyPolicy}>
                            privacy policy
                        </LinkNav>
                        .
                    </>
                }
            </OnboardingCard>
        </Aligner>
    )
}

export { OnboardingConsent }
