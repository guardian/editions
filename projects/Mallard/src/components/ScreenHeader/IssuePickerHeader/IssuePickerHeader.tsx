import React from 'react'
import { useNavigation } from '@react-navigation/native'
import { SpecialEditionHeaderStyles } from 'src/common'
import { ScreenHeader } from '../ScreenHeader'
import { CloseButton } from 'src/components/Button/CloseButton'
import { SettingsButton } from 'src/components/Button/SettingsButton'
import { routeNames } from 'src/navigation/routes'

const IssuePickerHeader = ({
    headerStyles,
    subTitle,
    title,
}: {
    headerStyles?: SpecialEditionHeaderStyles
    subTitle?: string
    title: string
}) => {
    const navigation = useNavigation()
    return (
        <ScreenHeader
            leftAction={
                <SettingsButton
                    onPress={() => {
                        navigation.navigate(routeNames.Settings)
                    }}
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
    )
}

export { IssuePickerHeader }
