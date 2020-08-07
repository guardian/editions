import React from 'react'
import { OnboardingCard, CardAppearance } from './onboarding/onboarding-card'
import { Copy } from 'src/helpers/words'

const SubFoundModalCard = ({ close }: { close: () => void }) => (
    <OnboardingCard
        title={Copy.subFound.title}
        onDismissThisCard={() => {
            close()
        }}
        subtitle={Copy.subFound.subtitle}
        appearance={CardAppearance.blue}
        size="small"
        bottomContent={<></>}
    />
)

export { SubFoundModalCard }
