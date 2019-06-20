import React, { useMemo, useState } from 'react'
import { ScrollView, StyleSheet } from 'react-native'
import { NavigationScreenProp, NavigationEvents } from 'react-navigation'

import { container } from 'src/theme/styles'
import { Front } from 'src/components/front'
import { renderIssueDate } from 'src/helpers/issues'
import { Issue } from 'src/common'
import { Header } from 'src/components/header'

import { FlexErrorMessage } from 'src/components/layout/errors/flex-error-message'
import { ERR_404_MISSING_PROPS, GENERIC_ERROR } from 'src/helpers/words'
import { FlexCenter } from 'src/components/layout/flex-center'
import { useJsonOrEndpoint } from 'src/hooks/use-fetch'
import { withResponse } from 'src/hooks/use-response'
import { Spinner } from 'src/components/spinner'
import { useSettings } from 'src/hooks/use-settings'

const styles = StyleSheet.create({
    container,
    contentContainer: {
        flexGrow: 1,
    },
})

const useIssueResponse = (issue: Issue['key']) =>
    withResponse<Issue>(
        useJsonOrEndpoint<Issue>(issue, `issue`, {
            validator: res => res.fronts != null,
        }),
    )
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
    const [{ hasLiveDevMenu }] = useSettings()
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
                error: ({ message }) => (
                    <FlexErrorMessage
                        title={GENERIC_ERROR}
                        message={hasLiveDevMenu ? message : undefined}
                    />
                ),
                pending: () => (
                    <FlexCenter>
                        <Spinner />
                    </FlexCenter>
                ),
                success: issue => (
                    <>
                        <IssueHeader issue={issue} />
                        {(viewIsTransitioning
                            ? issue.fronts.slice(0, 2)
                            : issue.fronts
                        ).map(front => (
                            <Front
                                issue={issue.key}
                                key={front}
                                {...{ viewIsTransitioning, front }}
                            />
                        ))}
                        <Front
                            issue={issue.key}
                            {...{ viewIsTransitioning }}
                            front="best-awards"
                        />
                        <Front
                            issue={issue.key}
                            {...{ viewIsTransitioning }}
                            front="cities"
                        />
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
