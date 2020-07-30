import React from 'react'
import { OnboardingCard, CardAppearance } from './onboarding/onboarding-card'
import { SUB_FOUND_TITLE, SUB_FOUND_SUBTITLE } from 'src/helpers/words'

const SubFoundModalCard = ({ close }: { close: () => void }) => (
    <OnboardingCard
        title={SUB_FOUND_TITLE}
        onDismissThisCard={() => {
            close()
        }}
        subtitle={SUB_FOUND_SUBTITLE}
        appearance={CardAppearance.blue}
        size="small"
        bottomContent={<></>}
    />
)

export { SubFoundModalCard }
