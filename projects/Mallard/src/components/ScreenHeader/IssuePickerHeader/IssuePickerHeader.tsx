import React from 'react'
import { NavigationInjectedProps, withNavigation } from 'react-navigation'
import { SpecialEditionHeaderStyles } from 'src/common'
import { navigateToSettings } from 'src/navigation/helpers/base'
import { CloseButton } from 'src/components/Button/CloseButton'
import { SettingsButton } from 'src/components/Button/SettingsButton'
import { Header } from 'src/components/layout/header/header'
import { IssueTitle } from 'src/components/issue/issue-title'
import { styles } from 'src/components/styled-text'

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
        <Header
            alignment={'drawer'}
            onPress={() => navigation.goBack()}
            action={
                <CloseButton
                    accessibilityLabel="Close button"
                    accessibilityHint="Returns to the edition"
                    onPress={() => navigation.goBack()}
                />
            }
            leftAction={
                <SettingsButton
                    onPress={() => {
                        navigateToSettings(navigation)
                    }}
                />
            }
            headerStyles={headerStyles}
        >
            {title ? (
                <IssueTitle
                    title={title}
                    subtitle={subTitle}
                    titleStyle={styles.issueLightText}
                    overwriteStyles={headerStyles}
                />
            ) : null}
        </Header>
    ),
)

export { IssuePickerHeader }
