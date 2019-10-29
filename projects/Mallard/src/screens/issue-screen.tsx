import React, { ReactElement } from 'react'
import {
    Animated,
    Image,
    StyleProp,
    StyleSheet,
    View,
    ViewStyle,
} from 'react-native'
import { FlatList } from 'react-native-gesture-handler'
import { NavigationInjectedProps, withNavigation } from 'react-navigation'
import { Issue, PageLayoutSizes } from 'src/common'
import { Button } from 'src/components/button/button'
import { Front } from 'src/components/front'
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
import {
    CONNECTION_FAILED_AUTO_RETRY,
    CONNECTION_FAILED_ERROR,
    CONNECTION_FAILED_SUB_ERROR,
    REFRESH_BUTTON_TEXT,
} from 'src/helpers/words'
import { useIssueResponse } from 'src/hooks/use-issue'
import {
    issueSummaryToLatestPath,
    useIssueSummary,
} from 'src/hooks/use-issue-summary'
import { useDimensions, useMediaQuery } from 'src/hooks/use-screen'
import { useIsPreview } from 'src/hooks/use-settings'
import { navigateToIssueList } from 'src/navigation/helpers/base'
import { useNavigatorPosition } from 'src/navigation/helpers/transition'
import { PathToIssue } from 'src/paths'
import { sendPageViewEvent } from 'src/services/ophan'
import { Breakpoints } from 'src/theme/breakpoints'
import { color } from 'src/theme/color'
import { metrics } from 'src/theme/spacing'
import { useIssueScreenSize, WithIssueScreenSize } from './issue/use-size'
import { useIsWeatherShown } from 'src/hooks/use-is-weather-shown'

const styles = StyleSheet.create({
    weatherWide: {
        marginHorizontal: metrics.horizontal,
        height: 78,
    },
    weatherHidden: {
        height: 16,
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
    illustrationImage: {
        width: '100%',
        height: 100,
    },
    illustrationPosition: {
        position: 'relative',
        bottom: 0,
        left: 0,
        height: '15%',
        right: 0,
    },
})

const ScreenHeader = withNavigation(
    ({ issue, navigation }: { issue?: Issue } & NavigationInjectedProps) => {
        const position = useNavigatorPosition()
        const { date, weekday } = useIssueDate(issue)
        const isTablet = useMediaQuery(
            width => width >= Breakpoints.tabletVertical,
        )

        const goToIssueList = () => {
            navigateToIssueList(navigation)
        }

        return (
            <Header
                accessibilityHint="More issues"
                onPress={() => {
                    goToIssueList()
                }}
                action={
                    <Button
                        icon={isTablet ? '' : ''}
                        alt="More issues"
                        onPress={() => {
                            goToIssueList()
                        }}
                    />
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
    const { container, card } = useIssueScreenSize()
    const { width } = useDimensions()
    /* setting a key will force a rerender on rotation, removing 1000s of layout bugs */
    return (
        <FlatList
            showsHorizontalScrollIndicator={false}
            ListHeaderComponent={ListHeaderComponent}
            // These three props are responsible for the majority of
            // performance improvements
            initialNumToRender={2}
            windowSize={2}
            maxToRenderPerBatch={2}
            showsVerticalScrollIndicator={false}
            scrollEventThrottle={1}
            ListFooterComponent={() => (
                <>
                    <View style={[styles.illustrationPosition]}>
                        <Image
                            style={styles.illustrationImage}
                            resizeMode={'contain'}
                            source={require('src/assets/images/privacy.png')}
                        />
                    </View>
                    <View style={{ height: container.height / 3 }} />
                </>
            )}
            getItemLayout={(_: any, index: number) => ({
                length: card.height + metrics.fronts.sliderRadius * 2,
                offset: (card.height + metrics.fronts.sliderRadius * 2) * index,
                index,
            })}
            keyExtractor={item => item}
            data={issue.fronts}
            style={style}
            key={width}
            renderItem={({ item: key }) => (
                <Front
                    localIssueId={issue.localId}
                    publishedIssueId={issue.publishedId}
                    front={key}
                    key={key}
                />
            )}
        />
    )
}

const PreviewReloadButton = ({ onPress }: { onPress: () => void }) => {
    const preview = useIsPreview()
    return preview ? <ReloadButton onPress={onPress} /> : null
}

const handleError = (
    { message }: { message: string },
    _: unknown,
    { retry }: { retry: () => void },
) => (
    <>
        <ScreenHeader />

        <FlexErrorMessage
            debugMessage={message}
            title={CONNECTION_FAILED_ERROR}
            message={CONNECTION_FAILED_SUB_ERROR}
            action={[REFRESH_BUTTON_TEXT, retry]}
        />
    </>
)

const handlePending = () => (
    <>
        <ScreenHeader />
        <FlexCenter>
            <Spinner />
        </FlexCenter>
    </>
)

const handleIssueScreenError = (error: string) => (
    <>
        <ScreenHeader />
        <FlexErrorMessage
            debugMessage={error}
            title={CONNECTION_FAILED_ERROR}
            message={CONNECTION_FAILED_AUTO_RETRY}
        />
    </>
)

/** used to memoize the IssueScreenWithPath */
const pathsAreEqual = (a: PathToIssue, b: PathToIssue) =>
    a.localIssueId === b.localIssueId &&
    a.publishedIssueId === b.publishedIssueId

const IssueScreenWithPath = React.memo(
    ({ path }: { path: PathToIssue }) => {
        const response = useIssueResponse(path)
        const isWeatherShown = useIsWeatherShown()
        if (isWeatherShown.loading) return null
        if (isWeatherShown.error) throw isWeatherShown.error

        return response({
            error: handleError,
            pending: handlePending,
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
                                                        isWeatherShown.value ? (
                                                            <View
                                                                style={
                                                                    styles.weatherWide
                                                                }
                                                            >
                                                                <Weather />
                                                            </View>
                                                        ) : (
                                                            <View
                                                                style={
                                                                    styles.weatherHidden
                                                                }
                                                            />
                                                        )
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
                                        {isWeatherShown.value ? (
                                            <View style={styles.sideWeather}>
                                                <Weather />
                                            </View>
                                        ) : null}

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
        })
    },
    (prev, next) => pathsAreEqual(prev.path, next.path),
)

export const IssueScreen = () => {
    const { issueSummary, issueId, error } = useIssueSummary()
    return (
        <Container>
            {issueId ? (
                <IssueScreenWithPath path={issueId} />
            ) : issueSummary ? (
                <IssueScreenWithPath
                    path={issueSummaryToLatestPath(issueSummary)}
                />
            ) : error ? (
                error && handleIssueScreenError(error)
            ) : (
                handlePending()
            )}
        </Container>
    )
}
