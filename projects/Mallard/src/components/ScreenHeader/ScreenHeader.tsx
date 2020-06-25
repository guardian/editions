import React from 'react'
import { View } from 'react-native'
import { NavigationInjectedProps, withNavigation } from 'react-navigation'
import { Header } from 'src/components/layout/header/header'
import { useIssueDate } from 'src/helpers/issues'
import { useEditionsMenuEnabled } from 'src/hooks/use-config-provider'
import {
    navigateToEditionMenu,
    navigateToIssueList,
} from 'src/navigation/helpers/base'
import {
    IssueWithFronts,
    SpecialEditionHeaderStyles,
} from '../../../../Apps/common/src'
import { IssueMenuButton } from '../Button/IssueMenuButton'
import { EditionsMenuButton } from '../EditionsMenu/EditionsMenuButton/EditionsMenuButton'
import { IssueTitle } from '../issue/issue-title'

export const ScreenHeader = withNavigation(
    ({
        issue,
        navigation,
        headerStyles,
    }: {
        issue?: IssueWithFronts
        headerStyles?: SpecialEditionHeaderStyles
    } & NavigationInjectedProps) => {
        const { date, weekday } = useIssueDate(issue)
        const { editionsMenuEnabled } = useEditionsMenuEnabled()

        const goToIssueList = () => {
            navigateToIssueList(navigation)
        }

        const goToEditionsMenu = () => {
            navigateToEditionMenu(navigation)
        }

        return (
            <Header
                onPress={() => {
                    goToIssueList()
                }}
                action={<IssueMenuButton onPress={goToIssueList} />}
                leftAction={
                    editionsMenuEnabled && (
                        <EditionsMenuButton onPress={goToEditionsMenu} />
                    )
                }
                headerStyles={headerStyles}
            >
                <View>
                    <IssueTitle
                        title={weekday}
                        subtitle={date}
                        overwriteStyles={headerStyles}
                    />
                </View>
            </Header>
        )
    },
)
