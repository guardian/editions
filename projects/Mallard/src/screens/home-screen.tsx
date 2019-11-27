import React from 'react'
import { View, FlatList, StyleSheet } from 'react-native'
import {
    NavigationInjectedProps,
    NavigationScreenProp,
    withNavigation,
} from 'react-navigation'
import { IssueSummary } from 'src/common'
import { Button, ButtonAppearance } from 'src/components/button/button'
import { IssueRow } from 'src/components/issue/issue-row'
import { GridRowSplit } from 'src/components/issue/issue-title'
import { FlexCenter } from 'src/components/layout/flex-center'
import { IssuePickerHeader } from 'src/components/layout/header/header'
import { FlexErrorMessage } from 'src/components/layout/ui/errors/flex-error-message'
import { Spinner } from 'src/components/spinner'
import {
    CONNECTION_FAILED_AUTO_RETRY,
    CONNECTION_FAILED_ERROR,
} from 'src/helpers/words'
import { useIssueSummary } from 'src/hooks/use-issue-summary'
import { useMediaQuery } from 'src/hooks/use-screen'
import {
    navigateToIssue,
    navigateToSettings,
} from 'src/navigation/helpers/base'
import { WithAppAppearance } from 'src/theme/appearance'
import { Breakpoints } from 'src/theme/breakpoints'
import { metrics } from 'src/theme/spacing'
import { ApiState } from './settings/api-screen'
import { useIsUsingProdDevtools } from 'src/hooks/use-settings'
import { routeNames } from 'src/navigation/routes'
import { getIssueCardOverlayAmount } from 'src/navigation/navigators/underlay/transition'
import { Separator } from 'src/components/layout/ui/row'
import { color } from 'src/theme/color'

const HomeScreenHeader = withNavigation(
    ({
        navigation,
        onReturn,
    }: {
        onReturn: () => void
        onSettings: () => void
    } & NavigationInjectedProps) => {
        const isTablet = useMediaQuery(
            width => width >= Breakpoints.tabletVertical,
        )

        const action = (
            <Button
                icon={isTablet ? '' : ''}
                alt="Return to issue"
                onPress={onReturn}
            />
        )
        const settings = (
            <Button
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
                accessibilityHint={'Return to issue'}
                onPress={onReturn}
                action={action}
            />
        )
    },
)

const styles = StyleSheet.create({
    issueListFooter: {
        padding: metrics.horizontal,
        paddingTop: metrics.vertical * 2,
        paddingBottom: getIssueCardOverlayAmount() + metrics.vertical * 2,
    },
    issueListFooterGrid: {
        marginBottom: metrics.vertical,
    },
    issueList: {
        paddingTop: 0,
        backgroundColor: color.dimBackground,
    },
})

const IssueListFooter = ({ navigation }: NavigationInjectedProps) => {
    const isUsingProdDevtools = useIsUsingProdDevtools()
    const { setIssueId } = useIssueSummary()

    return (
        <View style={styles.issueListFooter}>
            <GridRowSplit style={styles.issueListFooterGrid}>
                <Button
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

const IssueList = withNavigation(
    React.memo(
        ({
            issueList,
            navigation,
        }: {
            issueList: IssueSummary[]
        } & NavigationInjectedProps) => {
            const { setIssueId } = useIssueSummary()
            return (
                <FlatList
                    ItemSeparatorComponent={Separator}
                    ListFooterComponent={
                        <View>
                            <Separator />
                            <IssueListFooter navigation={navigation} />
                        </View>
                    }
                    style={styles.issueList}
                    data={issueList}
                    renderItem={({ item: issueSummary }) => (
                        <IssueRow
                            onPress={() => {
                                navigateToIssue({
                                    navigation,
                                    navigationProps: {
                                        path: {
                                            localIssueId: issueSummary.localId,
                                            publishedIssueId:
                                                issueSummary.publishedId,
                                        },
                                    },
                                    setIssueId,
                                })
                            }}
                            issue={issueSummary}
                        />
                    )}
                />
            )
        },
    ),
)

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
                <IssueList issueList={issueSummary} />
            ) : error ? (
                <>
                    <FlexErrorMessage
                        debugMessage={error}
                        title={CONNECTION_FAILED_ERROR}
                        message={CONNECTION_FAILED_AUTO_RETRY}
                    />
                </>
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
