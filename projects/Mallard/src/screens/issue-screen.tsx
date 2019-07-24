import React, { useState } from 'react'
import {
    NavigationScreenProp,
    NavigationEvents,
    FlatList,
    NavigationInjectedProps,
} from 'react-navigation'

import { Front } from 'src/components/front'
import { Issue } from 'src/common'
import { IssueHeader } from 'src/components/layout/header/header'

import { FlexErrorMessage } from 'src/components/layout/ui/errors/flex-error-message'
import { FlexCenter } from 'src/components/layout/flex-center'
import { useIssueOrLatestResponse } from 'src/hooks/use-issue'
import { Spinner } from 'src/components/spinner'

import { withNavigation } from 'react-navigation'
import { Button, ButtonAppearance } from 'src/components/button/button'
import { navigateToIssueList, navigateToSettings } from 'src/navigation/helpers'
import { Container } from 'src/components/layout/ui/container'
import { Weather } from 'src/components/weather'

export interface PathToIssue {
    issue: Issue['key']
}

const Header = withNavigation(
    ({ issue, navigation }: { issue?: Issue } & NavigationInjectedProps) => {
        const settings = (
            <Button
                icon=""
                alt="Settings"
                onPress={() => {
                    navigateToSettings(navigation)
                }}
                appearance={ButtonAppearance.skeleton}
            />
        )

        return (
            <IssueHeader
                leftAction={settings}
                accessibilityHint="More issues"
                onPress={() => {
                    navigateToIssueList(navigation)
                }}
                action={
                    <Button
                        icon=""
                        alt="More issues"
                        onPress={() => {
                            navigateToIssueList(navigation)
                        }}
                    />
                }
                issue={issue}
            />
        )
    },
)

const IssueScreenWithPath = ({ path }: { path: PathToIssue | undefined }) => {
    /*
    we don't wanna render a massive tree at once
    as the navigator is trying to push the screen bc this
    delays the tap response

    we can pass this prop to identify if we wanna render
    just the 'above the fold' content or the whole shebang
    */
    const response = useIssueOrLatestResponse(path && path.issue)
    const [viewIsTransitioning, setViewIsTransitioning] = useState(true)

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
                        <Header />

                        <FlexErrorMessage
                            debugMessage={message}
                            action={['Retry', retry]}
                        />
                    </>
                ),
                pending: () => (
                    <>
                        <Header />
                        <FlexCenter>
                            <Spinner />
                        </FlexCenter>
                    </>
                ),
                success: issue => (
                    <>
                        <Header issue={issue} />
                        <FlatList
                            data={issue.fronts.map((key, index) => ({
                                key,
                                index,
                            }))}
                            windowSize={3}
                            maxToRenderPerBatch={2}
                            initialNumToRender={1}
                            ListHeaderComponent={<Weather />}
                            keyExtractor={item => `${item.index}${item.key}`}
                            renderItem={({ item }) => (
                                <Front
                                    issue={issue.key}
                                    front={item.key}
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
