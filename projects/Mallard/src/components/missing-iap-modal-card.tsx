import React from 'react'
import { OnboardingCard, CardAppearance } from './onboarding/onboarding-card'

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
        size="small"
        mainActions={[
            {
                label: 'Try again',
                onPress: () => {
                    close()
                    onTryAgain()
                },
            },
            {
                label: 'Close',
                onPress: () => {
                    close()
                },
            },
        ]}
    />
)

export { MissingIAPModalCard }
