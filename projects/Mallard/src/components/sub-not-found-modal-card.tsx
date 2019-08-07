import React from 'react'
import { OnboardingCard, CardAppearance } from './onboarding/onboarding-card'

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
        mainActions={[
            {
                label: 'Sign-in with different account',
                onPress: () => {
                    close()
                    onLoginPress()
                },
            },
            {
                label: 'Activate with subscriber ID',
                onPress: () => {
                    close()
                    onOpenCASLogin()
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
