import React, { useState, useMemo } from 'react'
import {
    NavigationScreenProp,
    NavigationEvents,
    FlatList,
    NavigationInjectedProps,
} from 'react-navigation'

import { Front } from 'src/components/front'
import { Issue } from 'src/common'
import { Header } from 'src/components/header'

import { FlexErrorMessage } from 'src/components/layout/ui/errors/flex-error-message'
import { GENERIC_ERROR } from 'src/helpers/words'
import { FlexCenter } from 'src/components/layout/flex-center'
import { useIssueWithResponse, getIssueResponse } from 'src/hooks/use-issue'
import { Spinner } from 'src/components/spinner'
import { useSettings } from 'src/hooks/use-settings'

import { getLatestIssue } from 'src/hooks/use-api'
import { withNavigation } from 'react-navigation'
import { Button } from 'src/components/button/button'
import { navigateToIssueList } from 'src/navigation/helpers'
import { renderIssueDate } from 'src/helpers/issues'
import { Container } from 'src/components/layout/ui/container'
import { Weather } from 'src/components/weather'

export interface PathToIssue {
    issue: Issue['key']
}

const IssueHeader = withNavigation(
    ({ issue, navigation }: { issue?: Issue } & NavigationInjectedProps) => {
        const { date, weekday } = useMemo(
            () =>
                issue
                    ? renderIssueDate(issue.date * 1000 || Date.now())
                    : { date: 'Issue', weekday: 'undefined' },
            [issue && issue.key, issue],
        )
        return (
            <Header
                action={
                    <Button
                        icon=""
                        alt="More issues"
                        onPress={() => navigateToIssueList(navigation)}
                    />
                }
                title={date}
                subtitle={weekday}
            />
        )
    },
)

const IssueScreenWithPath = ({ path }: { path: PathToIssue | undefined }) => {
    const response = useIssueWithResponse(
        path ? getIssueResponse(path.issue) : getLatestIssue(),
        [path ? path.issue : 'latest'],
    )
    /*
    we don't wanna render a massive tree at once
    as the navigator is trying to push the screen bc this
    delays the tap response

    we can pass this prop to identify if we wanna render
    just the 'above the fold' content or the whole shebang
    */
    const [viewIsTransitioning, setViewIsTransitioning] = useState(true)
    const [{ isUsingProdDevtools }] = useSettings()
    return (
        <Container>
            <NavigationEvents
                onDidFocus={() => {
                    setViewIsTransitioning(false)
                }}
            />
            {response({
                error: ({ message }, { retry }) => (
                    <>
                        <IssueHeader />

                        <FlexErrorMessage
                            title={GENERIC_ERROR}
                            message={isUsingProdDevtools ? message : undefined}
                            action={['Retry', retry]}
                        />
                    </>
                ),
                pending: () => (
                    <>
                        <IssueHeader />
                        <FlexCenter>
                            <Spinner />
                        </FlexCenter>
                    </>
                ),
                success: issue => (
                    <>
                        <IssueHeader issue={issue} />
                        <FlatList
                            data={issue.fronts}
                            windowSize={3}
                            maxToRenderPerBatch={2}
                            initialNumToRender={1}
                            ListHeaderComponent={<Weather />}
                            keyExtractor={item => item}
                            renderItem={({ item }) => (
                                <Front
                                    issue={issue.key}
                                    front={item}
                                    {...{ viewIsTransitioning }}
                                />
                            )}
                        />
                    </>
                ),
            })}
        </Container>
    )
}

export const IssueScreen = ({
    navigation,
}: {
    navigation: NavigationScreenProp<{}>
}) => {
    const path = navigation.getParam('path') as PathToIssue | undefined
    if (!path || !path.issue) return <IssueScreenWithPath path={undefined} />
    return <IssueScreenWithPath path={path} />
}
