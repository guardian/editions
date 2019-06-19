import React, { useMemo, useState } from 'react'
import { ScrollView, StyleSheet } from 'react-native'
import { NavigationScreenProp, NavigationEvents } from 'react-navigation'

import { container } from '../theme/styles'
import { Front } from '../components/front'
import { renderIssueDate } from '../helpers/issues'
import { Issue } from 'src/common'
import { Header } from '../components/header'
import { useEndpointResponse } from 'src/hooks/use-fetch'
import { Spinner } from 'src/components/spinner'
import { FlexErrorMessage } from 'src/components/layout/errors/flex-error-message'
import { ERR_404_MISSING_PROPS } from 'src/helpers/words'
import { FlexCenter } from 'src/components/layout/flex-center'

const styles = StyleSheet.create({
    container,
    contentContainer: {},
})

const useIssueResponse = (issue: Issue['key']) =>
    useEndpointResponse<Issue>(`issue/${issue}`, res => res.fronts != null)
export interface PathToIssue {
    issue: Issue['key']
}

const IssueHeader = ({ issue }: { issue: Issue }) => {
    const { weekday, date } = useMemo(() => renderIssueDate(issue.date), [
        issue.date,
    ])

    return <Header title={weekday} subtitle={date} />
}

const IssueScreenWithProps = ({ path }: { path: PathToIssue }) => {
    const issueResponse = useIssueResponse(path.issue)

    /* 
    we don't wanna render a massive tree at once 
    as the navigator is trying to push the screen bc this
    delays the tap response 

    we can pass this prop to identify if we wanna render 
    just the 'above the fold' content or the whole shebang
    */
    const [viewIsTransitioning, setViewIsTransitioning] = useState(true)
    return (
        <ScrollView
            style={styles.container}
            contentContainerStyle={styles.contentContainer}
        >
            <NavigationEvents
                onDidFocus={() => {
                    setViewIsTransitioning(false)
                }}
            />
            {issueResponse({
                error: ({ message }) => <FlexErrorMessage title={message} />,
                pending: () => (
                    <FlexCenter>
                        <Spinner />
                    </FlexCenter>
                ),
                success: issue => (
                    <>
                        <IssueHeader issue={issue} />
                        {issue.fronts.map(front => (
                            <Front
                                key={front}
                                {...{ viewIsTransitioning, front }}
                            />
                        ))}
                        <Front
                            {...{ viewIsTransitioning }}
                            front="best-awards"
                        />
                        <Front {...{ viewIsTransitioning }} front="cities" />
                    </>
                ),
            })}
        </ScrollView>
    )
}

export const IssueScreen = ({
    navigation,
}: {
    navigation: NavigationScreenProp<{}>
}) => {
    const path = navigation.getParam('path') as PathToIssue | undefined
    if (!path || !path.issue)
        return <FlexErrorMessage title={ERR_404_MISSING_PROPS} />

    return <IssueScreenWithProps path={path} />
}
