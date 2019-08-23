import React from 'react'
import { OnboardingCard, CardAppearance } from './onboarding/onboarding-card'
import { ModalButton } from './modal-button'

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
        title="Subscription not found"
        appearance={CardAppearance.blue}
        size="small"
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
                <ModalButton
                    onPress={() => {
                        close()
                        onDismiss()
                    }}
                >
                    Close
                </ModalButton>
            </>
        }
    >
        We were unable to find a subscription with that account
    </OnboardingCard>
)

export { SubNotFoundModalCard }
