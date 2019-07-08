import React from 'react'
import {
    ScrollView,
    Button as NativeButton,
    StyleSheet,
    Platform,
    View,
} from 'react-native'
import { List, BaseList } from 'src/components/lists/list'
import { NavigationScreenProp } from 'react-navigation'
import { primaryContainer } from 'src/theme/styles'
import { ApiState } from './settings/api-screen'
import { WithAppAppearance } from 'src/theme/appearance'
import { metrics } from 'src/theme/spacing'
import { useFileList } from 'src/hooks/use-fs'
import { unzipIssue } from 'src/helpers/files'
import { GENERIC_ERROR } from 'src/helpers/words'
import { color } from 'src/theme/color'
import { Spinner } from 'src/components/spinner'
import { FlexErrorMessage } from 'src/components/layout/ui/errors/flex-error-message'
import { useSettings } from 'src/hooks/use-settings'
import { FlexCenter } from 'src/components/layout/flex-center'
import { useIssueSummary } from 'src/hooks/use-api'
import { Button } from 'src/components/button/button'
import { Heading, Footer } from 'src/components/layout/ui/row'
import { IssueRow } from 'src/components/layout/ui/issue-row'
import { useInsets } from 'src/hooks/use-insets'
import { Highlight } from 'src/components/highlight'
import { IssueTitleText } from 'src/components/styled-text'
import { IssueRowSplit } from 'src/components/issue'

const styles = StyleSheet.create({
    container: { ...primaryContainer, paddingTop: metrics.vertical * 2 },
})

const SettingsLink = ({ onPress }: { onPress: () => void }) => (
    <Highlight onPress={onPress}>
        <View
            style={{
                padding: metrics.horizontal,
                paddingVertical: metrics.vertical * 2,
                backgroundColor: color.palette.highlight.main,
                borderBottomColor: color.palette.neutral[100],
                borderBottomWidth: StyleSheet.hairlineWidth,
            }}
        >
            <IssueRowSplit>
                <IssueTitleText>Settings</IssueTitleText>
            </IssueRowSplit>
        </View>
    </Highlight>
)

export const HomeScreen = ({
    navigation,
}: {
    navigation: NavigationScreenProp<{}>
}) => {
    const [files, { refreshIssues }] = useFileList()
    const issueSummary = useIssueSummary()
    const [{ isUsingProdDevtools }] = useSettings()
    const { top: paddingTop } = useInsets()

    return (
        <WithAppAppearance value={'primary'}>
            <ScrollView style={styles.container}>
                <View style={{ paddingTop }}>
                    <SettingsLink
                        onPress={() => {
                            navigation.navigate('Settings')
                        }}
                    />
                </View>
                {issueSummary({
                    success: (issueList, { retry }) => (
                        <>
                            <BaseList
                                data={issueList}
                                renderItem={({ item }) => (
                                    <IssueRow
                                        onPress={() => {
                                            navigation.navigate('Issue', {
                                                issue: item.key,
                                            })
                                        }}
                                        issue={item}
                                    ></IssueRow>
                                )}
                            />
                            <Footer>
                                <Button onPress={retry}>Refresh</Button>
                            </Footer>
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
                <Footer>
                    <Button
                        onPress={() => {
                            navigation.navigate('Issue', {
                                path: null,
                            })
                        }}
                    >
                        Go to latest
                    </Button>
                </Footer>
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
            </ScrollView>
        </WithAppAppearance>
    )
}

HomeScreen.navigationOptions = {
    title: 'Home',
    header: null,
}
