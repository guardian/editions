import React, {
    useCallback,
    useState,
    useEffect,
    useRef,
    useMemo,
    Dispatch,
} from 'react'
import { View, FlatList, StyleSheet, Platform } from 'react-native'
import {
    NavigationInjectedProps,
    NavigationScreenProp,
    withNavigation,
    NavigationRoute,
} from 'react-navigation'
import { IssueSummary } from 'src/common'
import { Button, ButtonAppearance } from 'src/components/Button/Button'
import {
    IssueRow,
    ISSUE_ROW_HEADER_HEIGHT,
    ISSUE_FRONT_ROW_HEIGHT,
    ISSUE_FRONT_ERROR_HEIGHT,
} from 'src/components/issue/issue-row'
import { GridRowSplit } from 'src/components/issue/issue-title'
import { FlexCenter } from 'src/components/layout/flex-center'
import { IssuePickerHeader } from 'src/components/layout/header/header'
import { FlexErrorMessage } from 'src/components/layout/ui/errors/flex-error-message'
import { Spinner } from 'src/components/Spinner/Spinner'
import {
    CONNECTION_FAILED_AUTO_RETRY,
    CONNECTION_FAILED_ERROR,
} from 'src/helpers/words'
import { useIssueSummary } from 'src/hooks/use-issue-summary'
import {
    navigateToIssue,
    navigateToSettings,
} from 'src/navigation/helpers/base'
import { WithAppAppearance } from 'src/theme/appearance'
import { metrics } from 'src/theme/spacing'
import { ApiState } from './settings/api-screen'
import { useIsUsingProdDevtools } from 'src/hooks/use-settings'
import { routeNames } from 'src/navigation/routes'
import { useSetNavPosition } from 'src/hooks/use-nav-position'
import { NavigationParams } from 'react-navigation'
import { Separator } from 'src/components/layout/ui/row'
import { color } from 'src/theme/color'
import { useIssueResponse } from 'src/hooks/use-issue'
import { IssueWithFronts } from '../../../Apps/common/src'
import { PathToIssue } from 'src/paths'
import { Loaded } from 'src/helpers/Loaded'

const styles = StyleSheet.create({
    issueListFooter: {
        padding: metrics.horizontal,
        paddingTop: metrics.vertical * 2,
        paddingBottom: metrics.vertical * 8,
    },
    issueListFooterGrid: {
        marginBottom: metrics.vertical,
    },
    issueList: {
        paddingTop: 0,
        backgroundColor: color.dimBackground,
    },
    listPlaceholder: {
        backgroundColor: color.dimmerBackground,
        height: '100%',
    },
})

const HomeScreenHeader = withNavigation(
    ({
        navigation,
        onReturn,
    }: {
        onReturn: () => void
        onSettings: () => void
    } & NavigationInjectedProps) => {
        const action = (
            <Button
                accessibilityLabel="Close button"
                accessibilityHint="Returns to the edition"
                icon={'\uE04F'}
                alt="Return to edition"
                onPress={onReturn}
            />
        )
        const settings = (
            <Button
                accessibilityLabel="Settings button"
                accessibilityHint="Navigates to settings screen"
                icon={'\uE040'}
                alt="Settings"
                onPress={() => {
                    navigateToSettings(navigation)
                }}
                appearance={ButtonAppearance.skeleton}
            />
        )
        return (
            <IssuePickerHeader
                leftAction={settings}
                onPress={onReturn}
                action={action}
            />
        )
    },
)

const IssueRowContainer = React.memo(
    ({
        setIssueId: setLocalIssueId,
        issue,
        issueDetails,
        navigation,
    }: {
        setIssueId: Dispatch<PathToIssue>
        issue: IssueSummary
        issueDetails: Loaded<IssueWithFronts> | null
        navigation: NavigationScreenProp<
            NavigationRoute<NavigationParams>,
            NavigationParams
        >
    }) => {
        const { issueId, setIssueId } = useIssueSummary()
        const { localId, publishedId } = issue
        const setNavPosition = useSetNavPosition()

        const navToIssue = useCallback(
            (initialFrontKey: string | null) => {
                // Are we within the same edition? If so no need to navigate
                if (
                    issueId &&
                    issueId.localIssueId === localId &&
                    issueId.publishedIssueId === publishedId
                ) {
                    navigation.goBack()
                } else {
                    navigateToIssue({
                        navigation,
                        navigationProps: {
                            path: {
                                localIssueId: localId,
                                publishedIssueId: publishedId,
                            },
                            initialFrontKey,
                        },
                        setIssueId,
                    })
                }
            },
            [navigation, setIssueId, localId, publishedId, issueId],
        )

        const onPress = useCallback(() => {
            if (issueDetails != null) {
                setNavPosition(null)
                navToIssue(null)
                return
            }
            setLocalIssueId({
                localIssueId: localId,
                publishedIssueId: publishedId,
            })
        }, [
            setNavPosition,
            navToIssue,
            issueDetails,
            setLocalIssueId,
            localId,
            publishedId,
        ])

        const onPressFront = useCallback(
            frontKey => {
                if (
                    issueId != null &&
                    issueId.publishedIssueId === publishedId &&
                    issueId.localIssueId === localId
                ) {
                    setNavPosition({
                        frontId: frontKey,
                        articleIndex: 0,
                    })
                }
                navToIssue(frontKey)
            },
            [setNavPosition, navToIssue, issueId, publishedId, localId],
        )

        return (
            <IssueRow
                onPress={onPress}
                onPressFront={onPressFront}
                issue={issue}
                issueDetails={issueDetails}
                onGoToSettings={() =>
                    navigation.navigate({
                        routeName: routeNames.ManageEditions,
                    })
                }
            />
        )
    },
)

const IssueListFooter = ({ navigation }: NavigationInjectedProps) => {
    const isUsingProdDevtools = useIsUsingProdDevtools()
    const { setIssueId } = useIssueSummary()

    return (
        <View style={styles.issueListFooter}>
            <GridRowSplit style={styles.issueListFooterGrid}>
                <Button
                    accessibilityLabel="Manage editions button"
                    accessibilityHint="Navigates to manage editions screen"
                    appearance={ButtonAppearance.skeleton}
                    onPress={() => {
                        navigation.navigate({
                            routeName: routeNames.ManageEditions,
                        })
                    }}
                >
                    Manage editions
                </Button>
            </GridRowSplit>
            {isUsingProdDevtools ? (
                <GridRowSplit>
                    <Button
                        accessibilityLabel="Go to the latest edition button"
                        accessibilityHint="Navigates to the latest edition"
                        appearance={ButtonAppearance.skeleton}
                        onPress={() => {
                            navigateToIssue({
                                navigation,
                                navigationProps: {
                                    path: undefined,
                                },
                                setIssueId,
                            })
                        }}
                    >
                        Go to latest
                    </Button>
                </GridRowSplit>
            ) : null}
        </View>
    )
}

const ISSUE_ROW_HEIGHT = ISSUE_ROW_HEADER_HEIGHT + StyleSheet.hairlineWidth

const getFrontRowsHeight = (issue: Loaded<IssueWithFronts>) => {
    if (issue.isLoading) return 0
    if (issue.error != null) return ISSUE_FRONT_ERROR_HEIGHT + 1
    const { fronts } = issue.value
    return fronts.length * (ISSUE_FRONT_ROW_HEIGHT + 1)
}

const IssueListView = withNavigation(
    React.memo(
        ({
            issueList,
            currentIssue,
            navigation,
            setIssueId,
        }: {
            issueList: IssueSummary[]
            currentIssue: { id: PathToIssue; details: Loaded<IssueWithFronts> }
            setIssueId: Dispatch<PathToIssue>
        } & NavigationInjectedProps) => {
            const {
                localIssueId: localId,
                publishedIssueId: publishedId,
            } = currentIssue.id
            const { details } = currentIssue

            // We want to scroll to the current issue.
            const currentIssueIndex = issueList.findIndex(
                issue =>
                    issue.localId === localId &&
                    issue.publishedId === publishedId,
            )

            // Scroll to the relevant item if the current issue index has
            // changed (likely because the selected issue has changed itself).
            const listRef = useRef<FlatList<IssueSummary>>()
            const prevCurrentIndexRef = useRef<number>(currentIssueIndex)
            useEffect(() => {
                if (listRef.current == null || currentIssueIndex < 0) {
                    return
                }

                if (prevCurrentIndexRef.current === currentIssueIndex) return
                prevCurrentIndexRef.current = currentIssueIndex

                /* @types/react doesn't know about scroll functions */
                ;(listRef.current as any).scrollToIndex({
                    index: currentIssueIndex,
                })
            }, [currentIssueIndex])

            // We pass down the issue details only for the selected issue.
            const renderItem = useCallback(
                ({ item, index }) => (
                    <IssueRowContainer
                        setIssueId={setIssueId}
                        issue={item}
                        issueDetails={
                            index === currentIssueIndex ? details : null
                        }
                        navigation={navigation}
                    />
                ),
                [currentIssueIndex, details, navigation, setIssueId],
            )

            // Height of the fronts so we can provide this to `getItemLayout`.
            const frontRowsHeight = getFrontRowsHeight(details)

            // Changing the current issue will affect the layout, so that's
            // indeed a dependency of the callback.
            const getItemLayout = useCallback(
                (_, index) => {
                    return {
                        length:
                            ISSUE_ROW_HEADER_HEIGHT +
                            (index === currentIssueIndex ? frontRowsHeight : 0),
                        offset:
                            index * ISSUE_ROW_HEIGHT +
                            (currentIssueIndex >= 0 && index > currentIssueIndex
                                ? frontRowsHeight
                                : 0),
                        index,
                    }
                },
                [currentIssueIndex, frontRowsHeight],
            )

            const footer = useMemo(
                () => (
                    <View>
                        <Separator />
                        <IssueListFooter navigation={navigation} />
                    </View>
                ),
                [navigation],
            )

            const refFn = useCallback(
                (ref: FlatList<IssueSummary>) => {
                    listRef.current = ref
                },
                [listRef],
            )

            return (
                <FlatList
                    // Only render 4 because the fronts list will take up most
                    // space on the screen. This improves performance.
                    initialNumToRender={4}
                    ItemSeparatorComponent={Separator}
                    ListFooterComponent={footer}
                    style={styles.issueList}
                    data={issueList}
                    initialScrollIndex={
                        currentIssueIndex >= 0 ? currentIssueIndex : undefined
                    }
                    renderItem={renderItem}
                    // Necessary to make sure we re-render visible
                    // items when details changes.
                    extraData={details}
                    getItemLayout={getItemLayout}
                    ref={refFn}
                />
            )
        },
    ),
)

const IssueListViewWithDelay = ({
    issueList,
    currentId,
    currentIssue,
    setIssueId,
}: {
    issueList: IssueSummary[]
    currentId: PathToIssue
    currentIssue: Loaded<IssueWithFronts>
    setIssueId: Dispatch<PathToIssue>
}) => {
    const [shownIssue, setShownIssue] = useState({
        id: currentId,
        details: currentIssue,
    })

    // When we just pressed a issue row, it'll take a bit of time to
    // fetch the details (ex. list of fronts). During this time,
    // `currentIssueDetails` will be `null`. So in the meantime, we'll
    // keep showing the previous fronts.
    const { details } = shownIssue
    useEffect(() => {
        if (
            !currentIssue.isLoading &&
            (currentIssue.value !== details.value ||
                currentIssue.error !== details.error)
        ) {
            setShownIssue({ id: currentId, details: currentIssue })
        }
    }, [currentId, currentIssue, details])

    return (
        <IssueListView
            setIssueId={setIssueId}
            issueList={issueList}
            currentIssue={shownIssue}
        />
    )
}

const NO_ISSUES: IssueSummary[] = []
const EMPTY_ISSUE_ID = { localIssueId: '', publishedIssueId: '' }
const IssueListFetchContainer = () => {
    const data = useIssueSummary()
    const issueSummary = data.issueSummary || NO_ISSUES
    const [issueId, setIssueId] = useState(data.issueId || EMPTY_ISSUE_ID)
    const [isShown, setIsShown] = useState(
        // on iOS there is bug that causes wrong rendering of the scroll bar
        // if this is enabled. See below description of this mechanism.
        Platform.select({ android: false, default: true }),
    )

    useEffect(() => {
        // Adding a tiny delay before doing full rendering means that the
        // animation opening the "sidebar" of the app will happen immediately,
        // and while the animation happens we render the list. This better
        // parallelisation means we can get better perceived performance, but
        // the downside is that causes the list itself to "flash" in. Ideally
        // we'd have better rendering performance but that's not the case at
        // this point in time.
        //
        // `setTimeout` is necessary, otherwise React merges the `setIsShown`
        // within the original rendering.
        setTimeout(() => setIsShown(true), 0)
    }, [])

    const resp = useIssueResponse(issueId)
    if (!isShown) return <View style={styles.listPlaceholder} />

    return resp({
        error: (error: {}) => (
            <IssueListViewWithDelay
                setIssueId={setIssueId}
                issueList={issueSummary}
                currentId={issueId}
                currentIssue={{ error }}
            />
        ),
        pending: () => (
            <IssueListViewWithDelay
                setIssueId={setIssueId}
                issueList={issueSummary}
                currentId={issueId}
                currentIssue={{ isLoading: true }}
            />
        ),
        success: (value: IssueWithFronts) => (
            <IssueListViewWithDelay
                setIssueId={setIssueId}
                issueList={issueSummary}
                currentId={issueId}
                currentIssue={{ value }}
            />
        ),
    })
}

export const HomeScreen = ({
    navigation,
}: {
    navigation: NavigationScreenProp<{}>
}) => {
    const { issueSummary, error, setIssueId } = useIssueSummary()
    return (
        <WithAppAppearance value={'tertiary'}>
            <HomeScreenHeader
                onSettings={() => {
                    navigation.navigate('Settings')
                }}
                onReturn={() => {
                    navigateToIssue({
                        navigation,
                        navigationProps: {},
                        setIssueId,
                    })
                }}
            />
            {issueSummary ? (
                <IssueListFetchContainer />
            ) : error ? (
                <FlexErrorMessage
                    style={styles.issueList}
                    debugMessage={error}
                    title={CONNECTION_FAILED_ERROR}
                    message={CONNECTION_FAILED_AUTO_RETRY}
                />
            ) : (
                <FlexCenter>
                    <Spinner></Spinner>
                </FlexCenter>
            )}
            <ApiState />
        </WithAppAppearance>
    )
}

HomeScreen.navigationOptions = {
    title: 'Home',
    header: null,
}
