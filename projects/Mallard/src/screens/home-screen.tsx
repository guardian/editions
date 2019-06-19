import React, { useMemo } from 'react'
import {
    Image,
    ScrollView,
    Button,
    StyleSheet,
    View,
    Alert,
    Platform,
} from 'react-native'
import { List, ListHeading } from '../components/lists/list'
import { NavigationScreenProp } from 'react-navigation'
import { primaryContainer } from '../theme/styles'
import { ApiState } from './settings/api-screen'
import { WithAppAppearance } from '../theme/appearance'
import { metrics } from '../theme/spacing'
import { useFileList } from '../hooks/use-fs'
import { Issue } from 'src/common'
import { renderIssueDate } from '../helpers/issues'
import { unzipIssue } from '../helpers/files'
import { APP_DISPLAY_NAME } from 'src/helpers/words'
import { color } from 'src/theme/color'

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
                explainer: issue.key,
                data: {
                    issue: issue.key,
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
                    onPress={path => navigation.navigate('Issue', { path })}
                />
                {files.length > 0 && (
                    <>
                        <ListHeading>Issues on device</ListHeading>
                        <List
                            data={files
                                .filter(({ type }) => type !== 'other')
                                .map(file => ({
                                    key: file.issue,
                                    title:
                                        file.type === 'archive'
                                            ? 'Compressed issue'
                                            : file.issue,
                                    explainer:
                                        file.type === 'archive'
                                            ? 'Tap to unarchive'
                                            : undefined,
                                    data: file,
                                }))}
                            onPress={file => {
                                if (file.type === 'archive') {
                                    unzipIssue(file.issue).then(async () => {
                                        refreshIssues()
                                        Alert.alert(`Unzipped ${file.issue}`)
                                    })
                                } else {
                                    Alert.alert(
                                        'Hold there, this is not supported yet',
                                    )
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
    title: APP_DISPLAY_NAME,
    headerRight: (
        <Button
            onPress={() => {
                navigation.navigate('Settings')
            }}
            color={Platform.OS === 'ios' ? color.textOverPrimary : undefined}
            title="Settings"
        />
    ),
})
