import React from 'react'
import { StyleSheet, View } from 'react-native'
import {
    OnboardingCard,
    CardAppearance,
} from 'src/components/onboarding/onboarding-card'
import { ButtonAppearance } from 'src/components/button/button'
import { FEEDBACK_EMAIL } from 'src/helpers/words'
import { useGdprSwitches } from 'src/hooks/use-settings'
import { ModalButton } from 'src/components/modal-button'
import { LinkNav } from 'src/components/link'

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

const OnboardingConsent = ({
    onOpenGdprConsent,
    onContinue,
    onOpenPrivacyPolicy,
}: {
    onOpenGdprConsent: () => void
    onContinue: () => void
    onOpenPrivacyPolicy: () => void
}) => {
    const { enableNulls } = useGdprSwitches()
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
