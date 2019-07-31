import React from 'react'
import { OnboardingCard, CardAppearance } from './onboarding/onboarding-card'

const SubFoundModalCard = ({ close }: { close: () => void }) => (
    <OnboardingCard
        title="Subscription found"
        subtitle="Enjoy the Guardian and thank you for your support"
        appearance={CardAppearance.blue}
        size="small"
        mainActions={[
            {
                label: 'Close',
                onPress: () => {
                    close()
                },
            },
        ]}
    />
)

export { SubFoundModalCard }
