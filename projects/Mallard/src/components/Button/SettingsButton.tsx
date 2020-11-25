import React from 'react'
import { Button, ButtonAppearance } from './Button'

const SettingsButton = ({
    onPress,
    darkVersion = false,
}: {
    onPress: () => void
    darkVersion?: boolean
}) => (
    <Button
        accessibilityLabel="Settings button"
        accessibilityHint="Navigates to the settings screen"
        accessibilityRole="button"
        icon={'\uE040'}
        alt="Settings"
        onPress={onPress}
        appearance={
            darkVersion
                ? ButtonAppearance.skeletonBlack
                : ButtonAppearance.skeleton
        }
    />
)

export { SettingsButton }
