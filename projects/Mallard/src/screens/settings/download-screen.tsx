import React, { useState, useEffect, useMemo } from 'react'
import { ScrollView, Button, Text, View, Alert, Clipboard } from 'react-native'
import { List } from '../../components/lists/list'
import RNFetchBlob from 'rn-fetch-blob'
import { color } from '../../theme/color'
import { metrics } from '../../theme/spacing'
import { unzip } from 'react-native-zip-archive'
import {
    useFileList,
    displayFileSize,
    makeCacheFolder,
    rebuildCacheFolder,
    issuesDir,
} from '../../hooks/use-fs'

export const DownloadScreen = () => {
    const [files, refreshIssues] = useFileList()
    const [progress, setProgress] = useState(0)
    const fileList = useMemo(() => {
        const archives = files.filter(({ type }) => type !== 'other')
        const other = files.filter(({ type }) => type === 'other')
        return [
            ...archives.map(file => ({
                key: file.name,
                title: [file.type === 'issue' ? '🗞' : '📦', file.name].join(
                    ' ',
                ),
                explainer: `${displayFileSize(file.size)} – ${file.type}`,
                data: file,
            })),
            other.length && {
                key: 'others',
                title: `😧 ${other.length} unknown files`,
                explainer: displayFileSize(
                    other
                        .map(({ size }) => size)
                        .reduce((acc, cur) => acc + cur, 0),
                ),
            },
        ].filter(({ key }) => key)
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
                            title={'Download Zip'}
                            onPress={() => {
                                RNFetchBlob.config({
                                    fileCache: true,
                                })
                                    .fetch(
                                        'GET',
                                        `https://github.com/guardian/dotcom-rendering/archive/master.zip?date=${Date.now()}`,
                                    )
                                    .progress((received, total) => {
                                        setProgress(received / total)
                                    })
                                    .then(async res => {
                                        await makeCacheFolder()
                                        await RNFetchBlob.fs.mv(
                                            res.path(),
                                            `${issuesDir}/test-${Date.now()}.zip`,
                                        )
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
                        title="Wipe cache"
                        onPress={() => {
                            Alert.alert(
                                'Delete cache',
                                'Ya sure lass?',
                                [
                                    {
                                        text: "Don't delete it",
                                    },
                                    {
                                        text: 'AWAY WITH IT',
                                        style: 'cancel',
                                        onPress: async () => {
                                            await rebuildCacheFolder()
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
                    onPress={({ type, path }) => {
                        if (type === 'archive') {
                            unzip(path, path + '-extracted')
                                .then(async () => {
                                    await RNFetchBlob.fs.unlink(path)
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
