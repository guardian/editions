import React from 'react'
import { NavigationInjectedProps, withNavigation } from 'react-navigation'
import { SpecialEditionHeaderStyles } from 'src/common'
import { Button, ButtonAppearance } from 'src/components/Button/Button'
import { navigateToSettings } from 'src/navigation/helpers/base'
import { ScreenHeader } from '../ScreenHeader'
import { CloseButton } from 'src/components/Button/CloseButton'

const IssuePickerHeader = withNavigation(
    ({
        headerStyles,
        navigation,
        subTitle,
        title,
    }: {
        headerStyles?: SpecialEditionHeaderStyles
        subTitle?: string
        title: string
    } & NavigationInjectedProps) => {
        const action = (
            <CloseButton
                accessibilityLabel="Close button"
                accessibilityHint="Returns to the edition"
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
                title={title}
                subTitle={subTitle}
                headerStyles={headerStyles}
            />
        )
    },
)

export { IssuePickerHeader }
