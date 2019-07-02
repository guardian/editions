import React, { useMemo } from 'react'
import {
    Image,
    ScrollView,
    Button as NativeButton,
    StyleSheet,
    View,
    Platform,
} from 'react-native'
import { List } from 'src/components/lists/list'
import { NavigationScreenProp } from 'react-navigation'
import { primaryContainer } from 'src/theme/styles'
import { ApiState } from './settings/api-screen'
import { WithAppAppearance } from 'src/theme/appearance'
import { metrics } from 'src/theme/spacing'
import { useFileList } from 'src/hooks/use-fs'
import { Issue } from 'src/common'
import { renderIssueDate } from 'src/helpers/issues'
import { unzipIssue } from 'src/helpers/files'
import { APP_DISPLAY_NAME, GENERIC_ERROR } from 'src/helpers/words'
import { color } from 'src/theme/color'
import { Header } from 'src/components/header'
import { issueSummaryPath, IssueSummary } from '../../../common/src'
import { withResponse } from 'src/helpers/response'
import { Spinner } from 'src/components/spinner'
import { FlexErrorMessage } from 'src/components/layout/ui/errors/flex-error-message'
import { useSettings } from 'src/hooks/use-settings'
import { FlexCenter } from 'src/components/layout/flex-center'
import { useApiEndpoint } from 'src/hooks/use-api'
import { Button } from 'src/components/button/button'
import { Heading } from 'src/components/layout/ui/row'

const demoIssues: Issue[] = [
    {
        key: 'alpha-edition',
        name: 'PROD dummy',
        date: new Date(Date.now()).getTime(),
        fronts: [],
    },
    {
        key: 'dd753c95-b0be-4f0c-98a8-3797374e71b6',
        name: 'CODE dummy',
        date: new Date(Date.now()).getTime(),
        fronts: [],
    },
]

const styles = StyleSheet.create({
    container: { ...primaryContainer, paddingTop: metrics.vertical * 4 },
})

const useIssueSummary = () =>
    withResponse<IssueSummary[]>(
        useApiEndpoint<IssueSummary[]>(issueSummaryPath()),
    )

export const HomeScreen = ({
    navigation,
}: {
    navigation: NavigationScreenProp<{}>
}) => {
    const [files, { refreshIssues }] = useFileList()
    const issueList = useMemo(
        () =>
            demoIssues.map(issue => ({
                key: issue.key,
                title: renderIssueDate(issue.date).date,
                explainer: issue.key,
                data: {
                    issue: issue.key,
                },
            })),
        demoIssues.map(({ key }) => key),
    )
    const issueSummary = useIssueSummary()
    const [{ isUsingProdDevtools }] = useSettings()

    return (
        <WithAppAppearance value={'primary'}>
            <Header title={APP_DISPLAY_NAME} />
            <ScrollView style={styles.container}>
                <Heading>Issues</Heading>
                {issueSummary({
                    success: (issueList, { retry }) => (
                        <>
                            <List
                                data={issueList.map(issue => ({
                                    title: renderIssueDate(issue.date * 1000)
                                        .date,
                                    explainer: issue.name,
                                    key: issue.date + issue.name,
                                    data: {
                                        issue: issue.key,
                                    },
                                }))}
                                onPress={path =>
                                    navigation.navigate('Issue', { path })
                                }
                            />
                            <View
                                style={{
                                    padding: metrics.vertical,
                                    paddingHorizontal: metrics.horizontal,
                                    paddingTop: metrics.vertical * 3,
                                    alignItems: 'flex-start',
                                }}
                            >
                                <Button onPress={retry}>Refresh</Button>
                            </View>
                        </>
                    ),
                    error: ({ message }, { retry }) => (
                        <FlexErrorMessage
                            title={GENERIC_ERROR}
                            message={isUsingProdDevtools ? message : undefined}
                            action={['Retry', retry]}
                        />
                    ),
                    pending: () => (
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
                {isUsingProdDevtools ? (
                    <>
                        <Heading>Hardcoded issues</Heading>
                        <List
                            data={issueList}
                            onPress={path =>
                                navigation.navigate('Issue', { path })
                            }
                        />
                    </>
                ) : null}
                <ApiState />
            </ScrollView>
        </WithAppAppearance>
    )
}

HomeScreen.navigationOptions = ({
    navigation,
}: {
    navigation: NavigationScreenProp<{}>
}) => ({
    title: 'Home',
    headerTitle: () => null,
    headerRight: (
        <NativeButton
            onPress={() => {
                navigation.navigate('Settings')
            }}
            color={Platform.OS === 'ios' ? color.textOverPrimary : undefined}
            title="Settings"
        />
    ),
})
