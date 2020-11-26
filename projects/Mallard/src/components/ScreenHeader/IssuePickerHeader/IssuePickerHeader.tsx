import React from 'react'
import { NavigationInjectedProps, withNavigation } from 'react-navigation'
import { SpecialEditionHeaderStyles } from 'src/common'
import { navigateToSettings } from 'src/navigation/helpers/base'
import { ScreenHeader } from '../ScreenHeader'
import { CloseButton } from 'src/components/Button/CloseButton'
import { SettingsButton } from 'src/components/Button/SettingsButton'

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
    } & NavigationInjectedProps) => (
        <ScreenHeader
            leftAction={
                <SettingsButton
                    onPress={() => {
                        navigateToSettings(navigation)
                    }}
                    darkVersion={!!headerStyles && false}
                />
            }
            onPress={() => navigation.goBack()}
            rightAction={
                <CloseButton
                    accessibilityLabel="Close button"
                    accessibilityHint="Returns to the edition"
                    onPress={() => navigation.goBack()}
                />
            }
            title={title}
            subTitle={subTitle}
            headerStyles={headerStyles}
        />
    ),
)

export { IssuePickerHeader }
