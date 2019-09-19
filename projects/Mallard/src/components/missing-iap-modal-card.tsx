import React from 'react'
import { OnboardingCard, CardAppearance } from './onboarding/onboarding-card'
import { ModalButton } from './modal-button'

const MissingIAPModalCard = ({
    close,
    onTryAgain,
}: {
    close: () => void
    onTryAgain: () => void
}) => (
    <OnboardingCard
        title="Verification error"
        subtitle="There was a problem whilst verifying your subscription"
        appearance={CardAppearance.blue}
        size="medium"
        onDismissThisCard={() => {
            close()
        }}
        bottomContent={
            <>
                <ModalButton
                    onPress={() => {
                        close()
                        onTryAgain()
                    }}
                >
                    Try again
                </ModalButton>
            </>
        }
    />
)

export { MissingIAPModalCard }
