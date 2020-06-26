import React from 'react'
import { NavigationInjectedProps, withNavigation } from 'react-navigation'
import { Button, ButtonAppearance } from 'src/components/Button/Button'
import { navigateToSettings } from 'src/navigation/helpers/base'
import { ScreenHeader } from '../ScreenHeader'

const IssuePickerHeader = withNavigation(
    ({ navigation }: NavigationInjectedProps) => {
        const action = (
            <Button
                accessibilityLabel="Close button"
                accessibilityHint="Returns to the edition"
                accessibilityRole="button"
                icon={'\uE04F'}
                alt="Return to edition"
                onPress={() => navigation.goBack()}
            />
        )
        const settings = (
            <Button
                accessibilityLabel="Settings button"
                accessibilityHint="Navigates to the settings screen"
                accessibilityRole="button"
                icon={'\uE040'}
                alt="Settings"
                onPress={() => {
                    navigateToSettings(navigation)
                }}
                appearance={ButtonAppearance.skeleton}
            />
        )
        return (
            <ScreenHeader
                leftAction={settings}
                onPress={() => navigation.goBack()}
                rightAction={action}
                title="Recent"
                subTitle="Editions"
            />
        )
    },
)

export { IssuePickerHeader }
