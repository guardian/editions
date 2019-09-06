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

const OnboardingIntro = ({ onContinue }: { onContinue: () => void }) => {
    return (
        <Aligner>
            <OnboardingCard
                appearance={CardAppearance.blue}
                title="Welcome to the Guardian daily"
                explainerTitle="Thank you for being a beta user"
                bottomExplainerContent={
                    <>
                        <ModalButton
                            onPress={() => {
                                onContinue()
                            }}
                            buttonAppearance={ButtonAppearance.dark}
                        >
                            Start
                        </ModalButton>
                    </>
                }
            >
                {`Send us your thoughts and bugs to ${FEEDBACK_EMAIL}`}
            </OnboardingCard>
        </Aligner>
    )
}

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
                explainerTitle="We won’t share your data without asking"
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
                        We use cookies and similar technology to improve your
                        experience and also to allow us to improve our service.
                        To find out more, read our{' '}
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

export { OnboardingIntro, OnboardingConsent }
