import React, { ReactElement } from 'react'
import { StyleProp, StyleSheet, View, ViewStyle } from 'react-native'
import {
    FlatList,
    NavigationInjectedProps,
    NavigationScreenProp,
    withNavigation,
} from 'react-navigation'
import { Issue } from 'src/common'
import { Button } from 'src/components/button/button'
import { Front } from 'src/components/front'
import { PageLayoutSizes } from 'src/components/front/helpers/helpers'
import { FlexCenter } from 'src/components/layout/flex-center'
import { IssueHeader } from 'src/components/layout/header/header'
import { Container } from 'src/components/layout/ui/container'
import { FlexErrorMessage } from 'src/components/layout/ui/errors/flex-error-message'
import { WithBreakpoints } from 'src/components/layout/ui/sizing/with-breakpoints'
import { WithLayoutRectangle } from 'src/components/layout/ui/sizing/with-layout-rectangle'
import { ReloadButton } from 'src/components/reloadButton'
import { Spinner } from 'src/components/spinner'
import { Weather } from 'src/components/weather'
import { clearCache } from 'src/helpers/fetch/cache'
import { useIssueOrLatestResponse } from 'src/hooks/use-issue'
import { useIsPreview } from 'src/hooks/use-settings'
import { navigateToIssueList } from 'src/navigation/helpers'
import { Breakpoints } from 'src/theme/breakpoints'
import { color } from 'src/theme/color'
import { metrics } from 'src/theme/spacing'
import { useIssueScreenSize, WithIssueScreenSize } from './issue/use-size'

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

const PreviewReloadButton = ({ onPress }: { onPress: () => void }) => {
    const preview = useIsPreview()
    return preview ? <ReloadButton onPress={onPress} /> : null
}

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
                success: (issue, { retry }) => (
                    <>
                        <PreviewReloadButton
                            onPress={() => {
                                clearCache()
                                retry()
                            }}
                        />

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
                                                <Header issue={issue} />
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
                                    <WithLayoutRectangle>
                                        {metrics => (
                                            <WithIssueScreenSize
                                                value={[
                                                    PageLayoutSizes.tablet,
                                                    metrics,
                                                ]}
                                            >
                                                <Header issue={issue} />
                                                <View
                                                    style={{
                                                        flexDirection: 'row',
                                                    }}
                                                >
                                                    <View
                                                        style={
                                                            styles.sideWeather
                                                        }
                                                    >
                                                        <Weather />
                                                    </View>
                                                    <IssueFronts
                                                        style={
                                                            styles.sideBySideFeed
                                                        }
                                                        issue={issue}
                                                    />
                                                </View>
                                            </WithIssueScreenSize>
                                        )}
                                    </WithLayoutRectangle>
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
