import React, { useState } from 'react'
import { StyleSheet, View } from 'react-native'
import {
    NavigationScreenProp,
    NavigationEvents,
    FlatList,
} from 'react-navigation'

import { container } from 'src/theme/styles'
import { Front } from 'src/components/front'
import { Issue } from 'src/common'
import { Header } from 'src/components/header'

import { FlexErrorMessage } from 'src/components/layout/ui/errors/flex-error-message'
import { ERR_404_MISSING_PROPS, GENERIC_ERROR } from 'src/helpers/words'
import { FlexCenter } from 'src/components/layout/flex-center'
import { useIssue } from 'src/hooks/use-issue'
import { withResponse } from 'src/helpers/response'
import { Spinner } from 'src/components/spinner'
import { useSettings } from 'src/hooks/use-settings'
import { FSPaths, APIPaths } from 'src/paths'

const styles = StyleSheet.create({
    container,
    contentContainer: {
        flexGrow: 1,
    },
})

const useIssueResponse = (issue: Issue['key']) =>
    withResponse<Issue>(
        useIssue<Issue>(issue, FSPaths.issue(issue), APIPaths.issue(issue), {
            validator: res => res.fronts != null,
        }),
    )
export interface PathToIssue {
    issue: Issue['key']
}

const IssueHeader = ({ issue }: { issue: Issue }) => {
    return <Header title={'Issue/'} subtitle={issue.name} />
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
    const [{ isUsingProdDevtools }] = useSettings()

    return (
        <View style={styles.container}>
            <NavigationEvents
                onDidFocus={() => {
                    setViewIsTransitioning(false)
                }}
            />
            {issueResponse({
                error: ({ message }) => (
                    <FlexErrorMessage
                        title={GENERIC_ERROR}
                        message={isUsingProdDevtools ? message : undefined}
                    />
                ),
                pending: () => (
                    <FlexCenter>
                        <Spinner />
                    </FlexCenter>
                ),
                success: issue => (
                    <>
                        <FlatList
                            data={issue.fronts}
                            windowSize={3}
                            maxToRenderPerBatch={2}
                            initialNumToRender={1}
                            ListHeaderComponent={<IssueHeader issue={issue} />}
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
        </View>
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
