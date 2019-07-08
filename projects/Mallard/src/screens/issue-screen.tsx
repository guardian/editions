import React, { useState } from 'react'
import { StyleSheet, View, Platform } from 'react-native'
import {
    NavigationScreenProp,
    NavigationEvents,
    FlatList,
    NavigationInjectedProps,
} from 'react-navigation'

import { container } from 'src/theme/styles'
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

const styles = StyleSheet.create({
    container,
    contentContainer: {
        flexGrow: 1,
    },
})

export interface PathToIssue {
    issue: Issue['key']
}

const IssueHeader = withNavigation(
    ({ issue, navigation }: { issue?: Issue } & NavigationInjectedProps) => {
        return (
            <Header
                action={
                    <Button onPress={() => navigateToIssueList(navigation)}>
                        Issues
                    </Button>
                }
                title={'Issue'}
                subtitle={issue && issue.name}
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
        <View style={styles.container}>
            <NavigationEvents
                onDidFocus={() => {
                    setViewIsTransitioning(false)
                }}
            />
            {response({
                error: ({ message }, { retry }) => (
                    <FlexErrorMessage
                        title={GENERIC_ERROR}
                        message={isUsingProdDevtools ? message : undefined}
                        action={['Retry', retry]}
                    />
                ),
                pending: () => (
                    <FlexCenter>
                        <Spinner />
                    </FlexCenter>
                ),
                success: issue => {
                    return (
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
                    )
                },
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
    if (!path || !path.issue) return <IssueScreenWithPath path={undefined} />
    return <IssueScreenWithPath path={path} />
}
