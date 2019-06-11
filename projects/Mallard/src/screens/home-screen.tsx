import React from 'react'
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
import { unzipIssue } from '../helpers/files'

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
                    data={[
                        {
                            key: 'sunday-30',
                            title: 'Sunday 30',
                            data: {
                                issue: 'sunday-30',
                            },
                        },
                        {
                            key: 'monday-1',
                            title: 'Monday 1',
                            data: {
                                issue: 'monday-1',
                            },
                        },
                    ]}
                    onPress={item =>
                        navigation.navigate('Article', {
                            headline: 'CATS ARE THE BEST PET',
                            path:
                                'politics/2019/jun/11/matt-hancock-refuses-to-rule-out-staying-in-eu-after-31-october',
                        })
                    }

                    // onPress={item => navigation.navigate('Front', item)}
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
