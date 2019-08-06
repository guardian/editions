import React, { useState, ReactElement } from 'react'
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
import { Button } from 'src/components/button/button'
import { navigateToIssueList } from 'src/navigation/helpers'
import { Container } from 'src/components/layout/ui/container'
import { Weather } from 'src/components/weather'
import {
    Responsive,
    IPAD_VERTICAL,
    IPAD_LANDSCAPE,
} from 'src/components/layout/ui/responsive'
import { Text, View, ViewStyle, StyleProp } from 'react-native'

export interface PathToIssue {
    issue: Issue['key']
}

const Header = withNavigation(
    ({ issue, navigation }: { issue?: Issue } & NavigationInjectedProps) => {
        return (
            <IssueHeader
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

const IssueFronts = ({
    issue,
    withWeather = true,
    style,
}: {
    issue: Issue
    withWeather?: boolean
    style?: StyleProp<ViewStyle>
}) => (
    <FlatList
        // this is horrible but in the worst case where we get duplicate ids
        // (which we have done in the past) then we shouldn't break the rendering
        // even if it does mean showing the same front twice
        // we could filter out duplicates but in this case it'd probably be more
        // obvious for someone previewing if we did render it twice
        data={issue.fronts.map((key, index) => ({
            key,
            index,
        }))}
        style={style}
        windowSize={3}
        maxToRenderPerBatch={2}
        initialNumToRender={1}
        ListHeaderComponent={withWeather ? <Weather /> : null}
        keyExtractor={item => `${item.index}::${item.key}`}
        renderItem={({ item }) => <Front issue={issue.key} front={item.key} />}
    />
)

const IssueScreenWithPath = ({ path }: { path: PathToIssue | undefined }) => {
    const response = useIssueOrLatestResponse(path && path.issue)

    return (
        <Container>
            {response({
                error: ({ message }, _, { retry }) => (
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
                        <Responsive>
                            {{
                                0: () => (
                                    <>
                                        <Header issue={issue} />
                                        <IssueFronts issue={issue} />
                                    </>
                                ),
                                [IPAD_VERTICAL]: () => (
                                    <>
                                        <Header issue={issue} />
                                        <View>
                                            <Weather
                                                style={{
                                                    position: 'absolute',
                                                    width: 100,
                                                    backgroundColor: 'tomato',
                                                }}
                                            ></Weather>
                                            <IssueFronts
                                                style={{ paddingLeft: 100 }}
                                                withWeather={false}
                                                issue={issue}
                                            />
                                        </View>
                                    </>
                                ),
                            }}
                        </Responsive>
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
