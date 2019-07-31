import React from 'react'
import { OnboardingCard, CardAppearance } from './onboarding/onboarding-card'

const SignInModalCard = ({
    close,
    onLoginPress,
    onDismiss,
}: {
    close: () => void
    onLoginPress: () => void
    onDismiss: () => void
}) => (
    <OnboardingCard
        title="Already a subscriber?"
        subtitle="Sign in to continue with the app"
        appearance={CardAppearance.blue}
        size="small"
        mainActions={[
            {
                label: 'Continue',
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
        Not subscribed yet? Learn more ...
    </OnboardingCard>
)

export { SignInModalCard }
