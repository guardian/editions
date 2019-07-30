import React from 'react'
import { OnboardingCard, CardAppearance } from './onboarding/onboarding-card'

const SubNotFoundModalCard = ({
    close,
    onLoginPress,
    onDismiss,
}: {
    close: () => void
    onLoginPress: () => void
    onDismiss: () => void
}) => (
    <OnboardingCard
        title="Subscription not found"
        appearance={CardAppearance.blue}
        mainActions={[
            {
                label: 'Sign-in with different account',
                onPress: () => {
                    close()
                    onLoginPress()
                },
            },
            {
                label: 'Close',
                onPress: () => {
                    close()
                    onDismiss()
                },
            },
        ]}
    >
        We were unable to find a subscription with that account
    </OnboardingCard>
)

export { SubNotFoundModalCard }
