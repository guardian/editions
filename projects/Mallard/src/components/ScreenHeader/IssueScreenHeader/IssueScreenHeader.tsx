import React from 'react'
import { IssueWithFronts, SpecialEditionHeaderStyles } from 'src/common'
import { useIssueDate } from 'src/helpers/issues'
import { IssueMenuButton } from '../../Button/IssueMenuButton'
import { EditionsMenuButton } from '../../EditionsMenu/EditionsMenuButton/EditionsMenuButton'
import { ScreenHeader } from '../ScreenHeader'
import { useEditions } from 'src/hooks/use-edition-provider'
import { routeNames } from 'src/navigation/routes'
import { useNavigation } from '@react-navigation/native'

const IssueScreenHeader = ({
    headerStyles,
    issue,
}: {
    headerStyles?: SpecialEditionHeaderStyles
    issue?: IssueWithFronts
}) => {
    const navigation = useNavigation()
    const { date, weekday } = useIssueDate(issue)

    const goToIssueList = () => {
        navigation.navigate(routeNames.IssueList)
    }

    const { setNewEditionSeen } = useEditions()

    const handleEditionMenuPress = () => {
        setNewEditionSeen()
        navigation.navigate(routeNames.EditionsMenu)
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
}

export { IssueScreenHeader }
