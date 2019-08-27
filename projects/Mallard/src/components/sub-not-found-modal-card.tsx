import React from 'react'
import { Platform, Linking } from 'react-native'
import { OnboardingCard, CardAppearance } from './onboarding/onboarding-card'
import { ModalButton } from './modal-button'
import { ButtonAppearance } from './button/button'

const SubNotFoundModalCard = ({
    close,
    onOpenCASLogin,
    onLoginPress,
    onDismiss,
}: {
    close: () => void
    onOpenCASLogin: () => void
    onLoginPress: () => void
    onDismiss: () => void
}) => (
    <OnboardingCard
        title="Already a subscriber?"
        appearance={CardAppearance.blue}
        size="small"
        explainerTitle="Not subscribed yet?"
        onDismissThisCard={() => {
            close()
            onDismiss()
        }}
        explainerSubtitle={
            Platform.OS === 'ios'
                ? 'To get a free trial with our Digital Pack, visit our website'
                : 'Get a free trial with our Digital Pack'
        }
        bottomContent={
            <>
                <ModalButton
                    onPress={() => {
                        close()
                        onLoginPress()
                    }}
                >
                    Sign-in with different account
                </ModalButton>
                <ModalButton
                    onPress={() => {
                        close()
                        onOpenCASLogin()
                    }}
                >
                    Activate with subscriber ID
                </ModalButton>
            </>
        }
        bottomExplainerContent={
            <>
                <ModalButton
                    onPress={() => {
                        if (Platform.OS === 'android') {
                            Linking.openURL(
                                'https://support.theguardian.com/uk/subscribe/digital',
                            )
                        }
                    }}
                    buttonAppearance={ButtonAppearance.dark}
                >
                    {Platform.OS === 'ios'
                        ? 'Learn more'
                        : 'Get your free 14 day trial'}
                </ModalButton>
            </>
        }
    >
        {}
    </OnboardingCard>
)

export { SubNotFoundModalCard }
