import React, { useMemo } from 'react'
import {
    Image,
    ScrollView,
    Button,
    StyleSheet,
    View,
    Alert,
} from 'react-native'
import { List, ListHeading } from '../components/lists/list'
import { NavigationScreenProp } from 'react-navigation'
import { primaryContainer } from '../theme/styles'
import { ApiState } from './settings/api-screen'
import { WithAppAppearance } from '../theme/appearance'
import { metrics } from '../theme/spacing'
import { useFileList } from '../hooks/use-fs'
import { Issue } from '../common'
import { renderIssueDate } from '../helpers/issues'
import { unzipIssue } from '../helpers/files'

const demoIssues: Issue[] = [
    {
        name: '',
        date: new Date(Date.now()).getTime(),
        fronts: [],
    },
    {
        name: '',
        date: new Date(Date.now() - 86400000).getTime(),
        fronts: [],
    },
]

const styles = StyleSheet.create({
    container: primaryContainer,
    welcomeImage: {
        width: 1024 / 8,
        height: 559 / 8,
        resizeMode: 'contain',
    },
    getStartedContainer: {
        alignItems: 'flex-start',
        marginHorizontal: metrics.horizontal,
        marginTop: metrics.vertical * 2,
    },
})

export const HomeScreen = ({
    navigation,
}: {
    navigation: NavigationScreenProp<{}>
}) => {
    const [files, { refreshIssues }] = useFileList()
    const issueList = useMemo(
        () =>
            demoIssues.map(issue => ({
                key: issue.date.toString(),
                title: renderIssueDate(issue.date).date,
                data: {
                    issue,
                },
            })),
        [demoIssues.map(({ date }) => date)],
    )
    return (
        <WithAppAppearance value={'primary'}>
            <ScrollView style={styles.container}>
                <View style={styles.getStartedContainer}>
                    <Image
                        source={require('../assets/images/logo.png')}
                        style={styles.welcomeImage}
                    />
                </View>
                <ListHeading>Demo issues</ListHeading>
                <List
                    data={issueList}
                    onPress={issue => navigation.navigate('Issue', issue)}
                />
                {files.length > 0 && (
                    <>
                        <ListHeading>Issues on device</ListHeading>
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
                                            ? undefined
                                            : 'Tap to unarchive',
                                    data: file,
                                }))}
                            onPress={file => {
                                if (file.type === 'archive') {
                                    unzipIssue(file.id).then(async () => {
                                        refreshIssues()
                                        navigation.navigate('Issue', {
                                            issue: {
                                                name: file.id,
                                            },
                                        })
                                    })
                                } else if (file.type === 'issue') {
                                    navigation.navigate('Issue', {
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

HomeScreen.navigationOptions = ({
    navigation,
}: {
    navigation: NavigationScreenProp<{}>
}) => ({
    title: 'Mallard',
    headerRight: (
        <Button
            onPress={() => {
                navigation.navigate('Settings')
            }}
            title="Settings"
        />
    ),
})
