import React, { ReactElement } from 'react'
import {
    NavigationScreenProp,
    FlatList,
    NavigationInjectedProps,
} from 'react-navigation'

import { Front } from 'src/components/front'
import { Issue } from 'src/common'
import { IssueHeader, Header } from 'src/components/layout/header/header'

import { FlexErrorMessage } from 'src/components/layout/ui/errors/flex-error-message'
import { FlexCenter } from 'src/components/layout/flex-center'
import { useIssueOrLatestResponse } from 'src/hooks/use-issue'
import { Spinner } from 'src/components/spinner'

import { withNavigation } from 'react-navigation'
import { Button } from 'src/components/button/button'
import { navigateToIssueList } from 'src/navigation/helpers/base'
import { Container } from 'src/components/layout/ui/container'
import { Weather } from 'src/components/weather'
import { WithBreakpoints } from 'src/components/layout/ui/sizing/with-breakpoints'
import {
    Text,
    View,
    ViewStyle,
    StyleProp,
    StyleSheet,
    Alert,
    Animated,
} from 'react-native'
import { metrics } from 'src/theme/spacing'
import { color } from 'src/theme/color'
import { Breakpoints } from 'src/theme/breakpoints'
import { WithIssueScreenSize, useIssueScreenSize } from './issue/use-size'
import { PageLayoutSizes } from 'src/components/front/helpers/helpers'
import { WithLayoutRectangle } from 'src/components/layout/ui/sizing/with-layout-rectangle'
import { ReloadButton } from 'src/components/reloadButton'
import { clearCache } from 'src/helpers/fetch/cache'
import { useSettings } from 'src/hooks/use-settings'
import { isPreview } from 'src/helpers/settings/defaults'
import { useNavigatorPosition } from 'src/navigation/helpers/transition'
import { IssueTitle } from 'src/components/issue/issue-title'
import { useIssueDate } from 'src/helpers/issues'
import { useMediaQuery } from 'src/hooks/use-screen'

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

const ScreenHeader = withNavigation(
    ({ issue, navigation }: { issue?: Issue } & NavigationInjectedProps) => {
        const position = useNavigatorPosition()
        const { date, weekday } = useIssueDate(issue)
        const isTablet = useMediaQuery(
            width => width >= Breakpoints.tabletVertical,
        )
        return (
            <Header
                accessibilityHint="More issues"
                onPress={() => {
                    navigateToIssueList(navigation)
                }}
                action={
                    <Animated.View
                        style={{
                            opacity: position.interpolate({
                                inputRange: [0, 1],
                                outputRange: [1, 0],
                            }),
                        }}
                    >
                        <Button
                            icon={isTablet ? '' : ''}
                            alt="More issues"
                            onPress={() => {
                                navigateToIssueList(navigation)
                            }}
                        />
                    </Animated.View>
                }
            >
                <Animated.View
                    style={{
                        opacity: position.interpolate({
                            inputRange: [0, 1],
                            outputRange: [1, 0],
                        }),
                    }}
                >
                    <IssueTitle title={weekday} subtitle={date} />
                </Animated.View>
            </Header>
        )
    },
)

const IssueFronts = ({
    issue,
    ListHeaderComponent,
    style,
}: {
    issue: Issue
    ListHeaderComponent?: ReactElement
    style?: StyleProp<ViewStyle>
}) => {
    const { container } = useIssueScreenSize()

    return (
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
            extraData={{
                ...container,
            }}
            style={style}
            removeClippedSubviews={false}
            ListHeaderComponent={ListHeaderComponent}
            ListFooterComponent={() => (
                <View style={{ height: container.height / 2 }} />
            )}
            keyExtractor={item => `${item.index}::${item.key}`}
            getItemLayout={(_, index) => ({
                length: container.height,
                offset: container.height * index,
                index,
            })}
            renderItem={({ item }) => (
                <View style={{ height: container.height }}>
                    <Front issue={issue.key} front={item.key} />
                </View>
            )}
        />
    )
}

const IssueScreenWithPath = ({ path }: { path: PathToIssue | undefined }) => {
    const response = useIssueOrLatestResponse(path && path.issue)
    const preview = isPreview(useSettings()[0])
    return (
        <Container>
            {response({
                error: ({ message }, _, { retry }) => (
                    <>
                        <ScreenHeader />

                        <FlexErrorMessage
                            debugMessage={message}
                            action={['Retry', retry]}
                        />
                    </>
                ),
                pending: () => (
                    <>
                        <ScreenHeader />
                        <FlexCenter>
                            <Spinner />
                        </FlexCenter>
                    </>
                ),
                success: (issue, { retry }) => (
                    <>
                        {preview && (
                            <ReloadButton
                                onPress={() => {
                                    clearCache()
                                    retry()
                                }}
                            />
                        )}
                        <ScreenHeader issue={issue} />
                        <WithBreakpoints>
                            {{
                                0: () => (
                                    <WithLayoutRectangle>
                                        {metrics => (
                                            <WithIssueScreenSize
                                                value={[
                                                    PageLayoutSizes.mobile,
                                                    metrics,
                                                ]}
                                            >
                                                <IssueFronts
                                                    ListHeaderComponent={
                                                        <View
                                                            style={
                                                                styles.weatherWide
                                                            }
                                                        >
                                                            <Weather />
                                                        </View>
                                                    }
                                                    issue={issue}
                                                />
                                            </WithIssueScreenSize>
                                        )}
                                    </WithLayoutRectangle>
                                ),
                                [Breakpoints.tabletVertical]: () => (
                                    <View
                                        style={{
                                            flexDirection: 'row',
                                        }}
                                    >
                                        <View style={styles.sideWeather}>
                                            <Weather />
                                        </View>

                                        <WithLayoutRectangle>
                                            {metrics => (
                                                <WithIssueScreenSize
                                                    value={[
                                                        PageLayoutSizes.tablet,
                                                        metrics,
                                                    ]}
                                                >
                                                    <IssueFronts
                                                        style={
                                                            styles.sideBySideFeed
                                                        }
                                                        issue={issue}
                                                    />
                                                </WithIssueScreenSize>
                                            )}
                                        </WithLayoutRectangle>
                                    </View>
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
