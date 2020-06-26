import React from 'react'
import { NavigationInjectedProps, withNavigation } from 'react-navigation'
import { useIssueDate } from 'src/helpers/issues'
import { useEditionsMenuEnabled } from 'src/hooks/use-config-provider'
import {
    navigateToEditionMenu,
    navigateToIssueList,
} from 'src/navigation/helpers/base'
import {
    IssueWithFronts,
    SpecialEditionHeaderStyles,
} from '../../../../../Apps/common/src'
import { IssueMenuButton } from '../../Button/IssueMenuButton'
import { EditionsMenuButton } from '../../EditionsMenu/EditionsMenuButton/EditionsMenuButton'
import { ScreenHeader } from '../ScreenHeader'

const IssueScreenHeader = withNavigation(
    ({
        headerStyles,
        issue,
        navigation,
    }: {
        headerStyles?: SpecialEditionHeaderStyles
        issue?: IssueWithFronts
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
            <ScreenHeader
                title={weekday}
                subTitle={date}
                onPress={goToIssueList}
                rightAction={<IssueMenuButton onPress={goToIssueList} />}
                leftAction={
                    editionsMenuEnabled ? (
                        <EditionsMenuButton onPress={goToEditionsMenu} />
                    ) : null
                }
                headerStyles={headerStyles}
            />
        )
    },
)

export { IssueScreenHeader }
