import React from 'react'
import { Platform } from 'react-native'
import { OnboardingCard, CardAppearance } from './onboarding/onboarding-card'
import { ModalButton } from './Button/ModalButton'

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
                ? 'To get a free trial with our digital subscription, visit our website'
                : 'Get a free trial with our digital subscription'
        }
        bottomContent={
            <>
                <ModalButton
                    onPress={() => {
                        close()
                        onLoginPress()
                    }}
                >
                    Sign in to activate
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
                {/* Being hidden temporarily - https://trello.com/c/FsoQQx3m/707-already-a-subscriber-hide-the-learn-more-button */}
                {/* <ModalButton
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
                </ModalButton> */}
            </>
        }
    ></OnboardingCard>
)

export { SubNotFoundModalCard }
