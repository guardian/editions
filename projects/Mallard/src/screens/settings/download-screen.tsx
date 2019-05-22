import React, { useState, useMemo } from 'react'
import { ScrollView, Button, Text, View, Alert, Clipboard } from 'react-native'
import { List } from '../../components/lists/list'
import RNFetchBlob from 'rn-fetch-blob'
import { color } from '../../theme/color'
import { metrics } from '../../theme/spacing'
import { useFileList } from '../../hooks/use-fs'
import { Item } from '../../components/lists/helpers'
import {
    File,
    displayFileSize,
    issuesDir,
    deleteAllFiles,
    downloadIssue,
    unzipIssue,
    deleteOtherFiles,
} from '../../helpers/files'

export const DownloadScreen = () => {
    const [files, { refreshIssues }] = useFileList()
    const [progress, setProgress] = useState(0)
    const fileList = useMemo((): Item<File>[] => {
        const archives = files.filter(({ type }) => type !== 'other')
        const other = files.filter(({ type }) => type === 'other')

        const returnable = archives.map(file => ({
            key: file.filename,
            title:
                file.type === 'issue'
                    ? `🗞 ${file.issue}`
                    : `📦 ${file.filename}`,
            explainer: `${displayFileSize(file.size)} – ${file.type}`,
            data: file,
        }))

        if (other.length) {
            returnable.push({
                key: 'others',
                title: `😧 ${other.length} unknown files`,
                explainer: displayFileSize(
                    other
                        .map(({ size }) => size)
                        .reduce((acc, cur) => acc + cur, 0),
                ),
                data: null,
            })
        }
        return returnable
    }, [files])
    return (
        <View style={{ flex: 1 }}>
            <View
                style={{
                    paddingVertical: metrics.vertical,
                    backgroundColor: color.dimBackground,
                    flex: 0,
                    flexDirection: 'row',
                    alignItems: 'center',
                    justifyContent: 'center',
                }}
            >
                <View style={{ marginHorizontal: metrics.horizontal / 2 }}>
                    {progress > 0 ? (
                        <Text>{`Downloading (${Math.ceil(
                            progress * 100,
                        )}%)`}</Text>
                    ) : (
                        <Button
                            title={'🌈 Download Issue'}
                            onPress={() => {
                                const dl = downloadIssue('noop')
                                setProgress(0.000001)
                                dl.progress((received, total) => {
                                    setProgress(received / total)
                                })
                                dl.promise
                                    .then(async () => {
                                        setProgress(0)
                                        refreshIssues()
                                    })
                                    .catch(errorMessage => {
                                        Alert.alert(errorMessage)
                                    })
                            }}
                        />
                    )}
                </View>
                <View style={{ marginHorizontal: metrics.horizontal / 2 }}>
                    <Button
                        title="💣 Cleanup"
                        onPress={() => {
                            Alert.alert(
                                'Delete cache',
                                'Ya sure lass?',
                                [
                                    {
                                        text: "Don't delete anything",
                                    },
                                    {
                                        text: 'Delete other files',
                                        style: 'cancel',
                                        onPress: async () => {
                                            await deleteOtherFiles()
                                            refreshIssues()
                                        },
                                    },
                                    {
                                        text: 'AWAY WITH IT ALL',
                                        style: 'cancel',
                                        onPress: async () => {
                                            await deleteAllFiles()
                                            refreshIssues()
                                        },
                                    },
                                ],
                                { cancelable: false },
                            )
                        }}
                    />
                </View>
            </View>

            <ScrollView style={{ flex: 1 }}>
                <List
                    data={fileList}
                    onPress={({ type, path, issue }) => {
                        if (type === 'archive') {
                            unzipIssue(issue)
                                .then(async () => {
                                    refreshIssues()
                                })
                                .catch(error => {
                                    alert(error)
                                    refreshIssues()
                                })
                        } else {
                            alert('oof')
                        }
                    }}
                />
                <View
                    style={{
                        alignItems: 'center',
                        justifyContent: 'center',
                        padding: metrics.vertical,
                    }}
                >
                    <View style={{ marginHorizontal: metrics.horizontal / 2 }}>
                        <Button
                            title="Copy local path to clipboard"
                            onPress={() => {
                                Clipboard.setString(issuesDir)
                                alert(issuesDir)
                            }}
                        />
                    </View>
                    <View style={{ marginHorizontal: metrics.horizontal / 2 }}>
                        <Button
                            title="Refresh list"
                            onPress={() => {
                                refreshIssues()
                            }}
                        />
                    </View>
                </View>
            </ScrollView>
        </View>
    )
}

DownloadScreen.navigationOptions = () => ({
    title: 'Downloads',
})
