import React from 'react'
import { OnboardingCard, CardAppearance } from './onboarding/onboarding-card'
import { ModalButton } from './modal-button'

const MissingIAPModalCard = ({
    title,
    subtitle,
    close,
    onTryAgain,
}: {
    title: string
    subtitle: string
    close: () => void
    onTryAgain: () => void
}) => (
    <OnboardingCard
        title={title}
        subtitle={subtitle}
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
