import React from 'react'
import { View, Alert } from 'react-native'
import { List, BaseList } from 'src/components/lists/list'
import { NavigationScreenProp } from 'react-navigation'
import { ApiState } from './settings/api-screen'
import { WithAppAppearance } from 'src/theme/appearance'
import { metrics } from 'src/theme/spacing'
import { useFileList } from 'src/hooks/use-fs'
import { unzipIssue } from 'src/helpers/files'
import { Spinner } from 'src/components/spinner'
import { FlexErrorMessage } from 'src/components/layout/ui/errors/flex-error-message'
import { FlexCenter } from 'src/components/layout/flex-center'
import { useIssueSummary } from 'src/hooks/use-api'
import { Button, ButtonAppearance } from 'src/components/button/button'
import { Heading } from 'src/components/layout/ui/row'
import { IssueRow } from 'src/components/issue/issue-row'
import { GridRowSplit } from 'src/components/issue/issue-title'
import { ScrollContainer } from 'src/components/layout/ui/container'
import { IssueHeader } from 'src/components/layout/header/header'
import { navigateToIssue } from 'src/navigation/helpers'
import { useIssueOrLatestResponse } from 'src/hooks/use-issue'
import { Issue, IssueSummary } from 'src/common'
import { useSettings } from 'src/hooks/use-settings'
import { navigateToSettings } from 'src/navigation/helpers'
import { withNavigation, NavigationInjectedProps } from 'react-navigation'

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
        const action = (
            <Button icon="" alt="Return to issue" onPress={onReturn} />
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
            error: () => <IssueHeader action={action} />,
            pending: () => <IssueHeader action={action} />,
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
        onRetry,
        navigation,
    }: {
        issueList: IssueSummary[]
        onRetry: () => void
    } & NavigationInjectedProps) => {
        const [{ isUsingProdDevtools }] = useSettings()
        return (
            <>
                <BaseList
                    style={{ paddingTop: 0 }}
                    data={issueList}
                    renderItem={({ item }) => (
                        <IssueRow
                            proxy={
                                <Button
                                    onPress={() => {
                                        Alert.alert(
                                            'Sorry, downloading is not supported yet',
                                        )
                                    }}
                                    icon={'\uE077'}
                                    alt={'Download'}
                                    appearance={ButtonAppearance.skeleton}
                                ></Button>
                            }
                            onPress={() => {
                                navigateToIssue(navigation, {
                                    path: {
                                        issue: item.key,
                                    },
                                })
                            }}
                            issue={item}
                        ></IssueRow>
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
                                onPress={onRetry}
                                icon={''}
                                alt={'refresh'}
                                appearance={ButtonAppearance.skeleton}
                            ></Button>
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
    const issueSummary = useIssueSummary()
    const [{ isUsingProdDevtools }] = useSettings()
    const from = navigation.getParam('from', undefined)

    return (
        <WithAppAppearance value={'tertiary'}>
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
                    success: (issueList, { retry }) => (
                        <IssueList issueList={issueList} onRetry={retry} />
                    ),
                    error: ({ message }, stale, { retry }) => (
                        <>
                            {stale ? (
                                <IssueList issueList={stale} onRetry={retry} />
                            ) : null}
                            <FlexErrorMessage
                                debugMessage={message}
                                action={['Retry', retry]}
                            />
                        </>
                    ),
                    pending: (stale, { retry }) =>
                        stale ? (
                            <IssueList issueList={stale} onRetry={retry} />
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
