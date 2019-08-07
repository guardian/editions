import React, { useState, ReactElement, ReactNode } from 'react'
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
import { WithBreakpoints } from 'src/components/layout/ui/with-breakpoints'
import { Text, View, ViewStyle, StyleProp, StyleSheet } from 'react-native'
import { metrics } from 'src/theme/spacing'
import { color } from 'src/theme/color'
import { Breakpoints } from 'src/theme/breakpoints'

export interface PathToIssue {
    issue: Issue['key']
}

const styles = StyleSheet.create({
    weatherWide: {
        marginHorizontal: metrics.horizontal,
    },
    sideWeather: {
        width: 78,
        flexShrink: 0,
        borderRightColor: color.line,
        borderRightWidth: 1,
    },
    sideBySideFeed: {
        paddingTop: metrics.vertical,
    },
})

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

const frontWrapperStyles = StyleSheet.create({
    root: { height: metrics.fronts.blockHeight },
})
const FrontWrapper = ({ children }: { children: ReactNode }) => (
    <View style={frontWrapperStyles.root}>{children}</View>
)

const IssueFronts = ({
    issue,
    ListHeaderComponent,
    style,
}: {
    issue: Issue
    ListHeaderComponent?: ReactElement
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
        ListHeaderComponent={ListHeaderComponent}
        keyExtractor={item => `${item.index}::${item.key}`}
        getItemLayout={(_, index) => ({
            length: metrics.fronts.blockHeight,
            offset: metrics.fronts.blockHeight * index,
            index,
        })}
        renderItem={({ item }) => (
            <FrontWrapper>
                <Front issue={issue.key} front={item.key} />
            </FrontWrapper>
        )}
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
                        <WithBreakpoints>
                            {{
                                0: () => (
                                    <>
                                        <Header issue={issue} />
                                        <IssueFronts
                                            ListHeaderComponent={
                                                <View
                                                    style={styles.weatherWide}
                                                >
                                                    <Weather />
                                                </View>
                                            }
                                            issue={issue}
                                        />
                                    </>
                                ),
                                [Breakpoints.tabletVertical]: () => (
                                    <>
                                        <Header issue={issue} />
                                        <View style={{ flexDirection: 'row' }}>
                                            <View style={styles.sideWeather}>
                                                <Weather />
                                            </View>
                                            <IssueFronts
                                                style={styles.sideBySideFeed}
                                                issue={issue}
                                            />
                                        </View>
                                    </>
                                ),
                            }}
                        </WithBreakpoints>
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
