import React from 'react';
import { View } from 'react-native';
import { NavigationEvents, NavigationInjectedProps, NavigationScreenProp, withNavigation } from 'react-navigation';
import { Issue, IssueSummary } from 'src/common';
import { Button, ButtonAppearance } from 'src/components/button/button';
import { IssueRow } from 'src/components/issue/issue-row';
import { GridRowSplit } from 'src/components/issue/issue-title';
import { FlexCenter } from 'src/components/layout/flex-center';
import { IssueHeader } from 'src/components/layout/header/header';
import { ScrollContainer } from 'src/components/layout/ui/container';
import { FlexErrorMessage } from 'src/components/layout/ui/errors/flex-error-message';
import { Heading } from 'src/components/layout/ui/row';
import { BaseList, List } from 'src/components/lists/list';
import { Spinner } from 'src/components/spinner';
import { unzipIssue } from 'src/helpers/files';
import { useIssueSummary } from 'src/hooks/use-api';
import { useFileList } from 'src/hooks/use-fs';
import { useIssueOrLatestResponse } from 'src/hooks/use-issue';
import { useMediaQuery } from 'src/hooks/use-screen';
import { useSettingsValue } from 'src/hooks/use-settings';
import { navigateToIssue, navigateToSettings } from 'src/navigation/helpers/base';
import { WithAppAppearance } from 'src/theme/appearance';
import { Breakpoints } from 'src/theme/breakpoints';
import { metrics } from 'src/theme/spacing';
import { ApiState } from './settings/api-screen';

const HomeScreenHeader = withNavigation(
    ({
        issue,
        navigation,
        onReturn,
    }: {
        issue?: Issue['key']
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
        const response = useIssueOrLatestResponse(issue)
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
        return response({
            error: () => <IssueHeader leftAction={settings} action={action} />,
            pending: () => (
                <IssueHeader leftAction={settings} action={action} />
            ),
            success: issue => (
                <IssueHeader
                    leftAction={settings}
                    issue={issue}
                    accessibilityHint={'Return to issue'}
                    onPress={onReturn}
                    action={action}
                />
            ),
        })
    },
)

const IssueList = withNavigation(
    ({
        issueList,
        navigation,
    }: {
        issueList: IssueSummary[]
    } & NavigationInjectedProps) => {
        const isUsingProdDevtools = useSettingsValue.isUsingProdDevtools()
        return (
            <>
                <BaseList
                    style={{ paddingTop: 0 }}
                    data={issueList}
                    renderItem={({ item }) => (
                        <IssueRow
                            onPress={() => {
                                navigateToIssue(navigation, {
                                    path: {
                                        issue: item.key,
                                    },
                                })
                            }}
                            issue={item}
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
)

export const HomeScreen = ({
    navigation,
}: {
    navigation: NavigationScreenProp<{}>
}) => {
    const [files, { refreshIssues }] = useFileList()
    const { response: issueSummary, retry } = useIssueSummary()
    const from = navigation.getParam('from', undefined)
    const isUsingProdDevtools = useSettingsValue.isUsingProdDevtools()

    return (
        <WithAppAppearance value={'tertiary'}>
            <NavigationEvents
                onDidFocus={() => {
                    retry()
                }}
            />
            <ScrollContainer>
                <HomeScreenHeader
                    issue={
                        from && from.path && from.path.issue
                            ? from.path.issue
                            : undefined
                    }
                    onSettings={() => {
                        navigation.navigate('Settings')
                    }}
                    onReturn={() => {
                        navigateToIssue(navigation, {
                            path: {
                                issue:
                                    from && from.path && from.path.issue
                                        ? from.path.issue
                                        : undefined,
                            },
                        })
                    }}
                />
                {issueSummary({
                    success: issueList => <IssueList issueList={issueList} />,
                    error: ({ message }, stale, { retry }) => (
                        <>
                            {stale ? <IssueList issueList={stale} /> : null}
                            <FlexErrorMessage
                                debugMessage={message}
                                action={['Retry', retry]}
                            />
                        </>
                    ),
                    pending: stale =>
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
                {files.length > 0 && (
                    <>
                        <Heading>Issues on device</Heading>
                        <List
                            data={files
                                .filter(
                                    ({ type }) =>
                                        type === 'archive' || type === 'issue',
                                )
                                .map(file => ({
                                    key: file.id,
                                    title:
                                        file.type === 'issue'
                                            ? file.issue.name
                                            : 'Compressed issue',
                                    explainer:
                                        file.type === 'issue'
                                            ? `From fs/${file.id}`
                                            : 'Tap to unarchive',
                                    data: file,
                                }))}
                            onPress={file => {
                                if (file.type === 'archive') {
                                    unzipIssue(file.id).then(async () => {
                                        refreshIssues()
                                        navigation.navigate('Issue', {
                                            path: file.id,
                                        })
                                    })
                                } else if (file.type === 'issue') {
                                    navigation.navigate('Issue', {
                                        path: { issue: file.issue.key },
                                        issue: file.issue,
                                    })
                                }
                            }}
                        />
                    </>
                )}
                <ApiState />
            </ScrollContainer>
        </WithAppAppearance>
    )
}

HomeScreen.navigationOptions = {
    title: 'Home',
    header: null,
}
