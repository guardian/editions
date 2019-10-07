import React from 'react'
import { View } from 'react-native'
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
import { ScrollContainer } from 'src/components/layout/ui/container'
import { FlexErrorMessage } from 'src/components/layout/ui/errors/flex-error-message'
import { BaseList } from 'src/components/lists/list'
import { Spinner } from 'src/components/spinner'
import {
    CONNECTION_FAILED_ERROR,
    CONNECTION_FAILED_SUB_ERROR,
    REFRESH_BUTTON_TEXT,
} from 'src/helpers/words'
import { useMediaQuery } from 'src/hooks/use-screen'
import { useSettingsValue } from 'src/hooks/use-settings'
import {
    navigateToIssue,
    navigateToSettings,
} from 'src/navigation/helpers/base'
import { Action, ComponentType, sendComponentEvent } from 'src/services/ophan'
import { WithAppAppearance } from 'src/theme/appearance'
import { Breakpoints } from 'src/theme/breakpoints'
import { metrics } from 'src/theme/spacing'
import { ApiState } from './settings/api-screen'
import { useIssueSummaryJames } from 'src/hooks/use-issue-summary'

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

const IssueList = withNavigation(
    React.memo(
        ({
            issueList,
            navigation,
        }: {
            issueList: IssueSummary[]
        } & NavigationInjectedProps) => {
            const isUsingProdDevtools = useSettingsValue.isUsingProdDevtools()
            const { setIssueId } = useIssueSummaryJames()
            return (
                <>
                    <BaseList
                        style={{ paddingTop: 0 }}
                        data={issueList}
                        renderItem={({ item: issueSummary }) => (
                            <IssueRow
                                onPress={() => {
                                    navigateToIssue(navigation, {
                                        path: {
                                            localIssueId: issueSummary.localId,
                                            publishedIssueId:
                                                issueSummary.publishedId,
                                        },
                                    })
                                    setIssueId({
                                        localIssueId: issueSummary.localId,
                                        publishedIssueId:
                                            issueSummary.publishedId,
                                    })
                                    sendComponentEvent({
                                        componentType: ComponentType.appButton,
                                        action: Action.click,
                                        value: 'issues_list_issue_clicked',
                                    })
                                }}
                                issue={issueSummary}
                            />
                        )}
                    />
                    {isUsingProdDevtools ? (
                        <View
                            style={{
                                padding: metrics.horizontal,
                                paddingVertical: metrics.vertical * 4,
                            }}
                        >
                            <GridRowSplit>
                                <Button
                                    appearance={ButtonAppearance.skeleton}
                                    onPress={() => {
                                        navigateToIssue(navigation, {
                                            path: undefined,
                                        })
                                    }}
                                >
                                    Go to latest
                                </Button>
                            </GridRowSplit>
                        </View>
                    ) : null}
                </>
            )
        },
    ),
)

export const HomeScreen = ({
    navigation,
}: {
    navigation: NavigationScreenProp<{}>
}) => {
    const {
        issueSummary: { response },
        issueId,
    } = useIssueSummaryJames()
    const isUsingProdDevtools = useSettingsValue.isUsingProdDevtools()
    return (
        <WithAppAppearance value={'tertiary'}>
            <HomeScreenHeader
                onSettings={() => {
                    navigation.navigate('Settings')
                }}
                onReturn={() => {
                    const issue = issueId || '/'
                    navigateToIssue(navigation, {
                        path: issue,
                    })
                }}
            />
            <ScrollContainer>
                {response({
                    success: (issueList: IssueSummary[]) => (
                        <IssueList issueList={issueList} />
                    ),
                    error: (
                        { message }: { message: string },
                        stale: IssueSummary[],
                        { retry }: { retry: () => void },
                    ) => (
                        <>
                            {stale ? <IssueList issueList={stale} /> : null}
                            <FlexErrorMessage
                                debugMessage={message}
                                title={CONNECTION_FAILED_ERROR}
                                message={CONNECTION_FAILED_SUB_ERROR}
                                action={[REFRESH_BUTTON_TEXT, retry]}
                            />
                        </>
                    ),
                    pending: (stale: IssueSummary[]) =>
                        stale ? (
                            <>
                                <IssueList issueList={stale} />
                                {isUsingProdDevtools ? (
                                    <Spinner></Spinner>
                                ) : null}
                            </>
                        ) : (
                            <FlexCenter>
                                <Spinner></Spinner>
                            </FlexCenter>
                        ),
                })}

                <ApiState />
            </ScrollContainer>
        </WithAppAppearance>
    )
}

HomeScreen.navigationOptions = {
    title: 'Home',
    header: null,
}
