import React, { ReactElement, useEffect } from 'react'
import { Animated, StyleProp, StyleSheet, View, ViewStyle } from 'react-native'
import { ScrollView } from 'react-native-gesture-handler'
import {
    NavigationInjectedProps,
    NavigationScreenProp,
    withNavigation,
} from 'react-navigation'
import { Issue } from 'src/common'
import { Button } from 'src/components/button/button'
import { Front } from 'src/components/front'
import { PageLayoutSizes } from 'src/components/front/helpers/helpers'
import { IssueTitle } from 'src/components/issue/issue-title'
import { FlexCenter } from 'src/components/layout/flex-center'
import { Header } from 'src/components/layout/header/header'
import { Container } from 'src/components/layout/ui/container'
import { FlexErrorMessage } from 'src/components/layout/ui/errors/flex-error-message'
import { WithBreakpoints } from 'src/components/layout/ui/sizing/with-breakpoints'
import { WithLayoutRectangle } from 'src/components/layout/ui/sizing/with-layout-rectangle'
import { ReloadButton } from 'src/components/reloadButton'
import { Spinner } from 'src/components/spinner'
import { Weather } from 'src/components/weather'
import { supportsTransparentCards } from 'src/helpers/features'
import { clearCache } from 'src/helpers/fetch/cache'
import { useIssueDate } from 'src/helpers/issues'
import { safeInterpolation } from 'src/helpers/math'
import {
    CONNECTION_FAILED_ERROR,
    CONNECTION_FAILED_SUB_ERROR,
    REFRESH_BUTTON_TEXT,
} from 'src/helpers/words'
import { useIssueOrLatestResponse } from 'src/hooks/use-issue'
import { useMediaQuery } from 'src/hooks/use-screen'
import { useIsPreview } from 'src/hooks/use-settings'
import { navigateToIssueList } from 'src/navigation/helpers/base'
import { useNavigatorPosition } from 'src/navigation/helpers/transition'
import { PathToIssue } from 'src/paths'
import { sendPageViewEvent } from 'src/services/ophan'
import { Breakpoints } from 'src/theme/breakpoints'
import { color } from 'src/theme/color'
import { metrics } from 'src/theme/spacing'
import { useIssueScreenSize, WithIssueScreenSize } from './issue/use-size'

const styles = StyleSheet.create({
    weatherWide: {
        marginHorizontal: metrics.horizontal,
        height: 78,
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
                        style={
                            supportsTransparentCards() && {
                                opacity: position.interpolate({
                                    inputRange: safeInterpolation([0, 1]),
                                    outputRange: safeInterpolation([1, 0]),
                                }),
                            }
                        }
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
                    style={
                        supportsTransparentCards() && {
                            opacity: position.interpolate({
                                inputRange: [0, 1],
                                outputRange: [1, 0],
                            }),
                        }
                    }
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
        <ScrollView style={style}>
            {ListHeaderComponent}
            {issue.fronts.map(key => (
                <Front
                    localIssueId={issue.localId}
                    publishedIssueId={issue.publishedId}
                    front={key}
                    key={key}
                />
            ))}
            <View style={{ height: container.height / 2 }} />
        </ScrollView>
    )
}

const PreviewReloadButton = ({ onPress }: { onPress: () => void }) => {
    const preview = useIsPreview()
    return preview ? <ReloadButton onPress={onPress} /> : null
}

const IssueScreenWithPath = ({ path }: { path: PathToIssue | undefined }) => {
    const response = useIssueOrLatestResponse(path)
    return (
        <Container>
            {response({
                error: ({ message }, _, { retry }) => (
                    <>
                        <ScreenHeader />

                        <FlexErrorMessage
                            debugMessage={message}
                            title={CONNECTION_FAILED_ERROR}
                            message={CONNECTION_FAILED_SUB_ERROR}
                            action={[REFRESH_BUTTON_TEXT, retry]}
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
                success: (issue, { retry }) => {
                    sendPageViewEvent({
                        path: `editions/uk/daily/${issue.key}`,
                    })
                    return (
                        <>
                            <PreviewReloadButton
                                onPress={() => {
                                    clearCache()
                                    retry()
                                }}
                            />
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
                    )
                },
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
    if (!path || !path.localIssueId)
        return <IssueScreenWithPath path={undefined} />
    return <IssueScreenWithPath path={path} />
}
