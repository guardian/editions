import React from 'react'
import { Button, ButtonAppearance } from './Button'
import { ArticlePillar } from '../../../../Apps/common/src'

const CloseButton = ({
    onPress,
    appearance,
    accessibilityLabel,
    accessibilityHint,
    pillar,
}: {
    onPress: () => void
    appearance?: ButtonAppearance
    accessibilityLabel: string
    accessibilityHint: string
    pillar?: ArticlePillar
}) => {
    return (
        <Button
            icon={'\uE04F'}
            alt="Dismiss"
            appearance={appearance || ButtonAppearance.default}
            onPress={onPress}
            accessibilityLabel={accessibilityLabel}
            accessibilityRole="button"
            accessibilityHint={accessibilityHint}
            pillar={pillar || null}
        />
    )
}

export { CloseButton }
