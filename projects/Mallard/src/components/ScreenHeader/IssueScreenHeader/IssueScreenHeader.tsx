import React from 'react'
import { NavigationInjectedProps, withNavigation } from 'react-navigation'
import { IssueWithFronts, SpecialEditionHeaderStyles } from 'src/common'
import { useIssueDate } from 'src/helpers/issues'
import {
    navigateToEditionMenu,
    navigateToIssueList,
} from 'src/navigation/helpers/base'
import { IssueMenuButton } from '../../Button/IssueMenuButton'
import { EditionsMenuButton } from '../../EditionsMenu/EditionsMenuButton/EditionsMenuButton'
import { ScreenHeader } from '../ScreenHeader'
import {
    useEditions,
} from 'src/hooks/use-edition-provider'

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

        const goToIssueList = () => {
            navigateToIssueList(navigation)
        }
        const { showEditionCard, setShowNewEditionCard } = useEditions()

        const handleEditionMenuPress = () => {
            showEditionCard ? setShowNewEditionCard(false) : null
            navigateToEditionMenu(navigation)
        }

        return (
            <ScreenHeader
                title={weekday}
                subTitle={date}
                onPress={goToIssueList}
                rightAction={<IssueMenuButton onPress={goToIssueList} />}
                leftAction={<EditionsMenuButton onPress={handleEditionMenuPress} />}
                headerStyles={headerStyles}
            />
        )
    },
)

export { IssueScreenHeader }
