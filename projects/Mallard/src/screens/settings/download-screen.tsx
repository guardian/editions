import React, { useState, useMemo } from 'react'
import { ScrollView, Button, Text, View, Alert, Clipboard } from 'react-native'
import { List, ListHeading } from '../../components/lists/list'
import { color } from '../../theme/color'
import { metrics } from '../../theme/spacing'
import { useFileList, useDownloadQueue } from '../../hooks/use-fs'
import { Item } from '../../components/lists/helpers'
import {
    File,
    displayFileSize,
    issuesDir,
    deleteAllFiles,
    unzipIssue,
    deleteOtherFiles,
} from '../../helpers/files'

export const DownloadScreen = () => {
    const [files, { refreshIssues }] = useFileList()
    const [queue, download] = useDownloadQueue()
    console.log(queue)
    const fileList = useMemo((): Item<File>[] => {
        const archives = files.filter(({ type }) => type !== 'other')
        const other = files.filter(({ type }) => type === 'other')

        const returnable: Item<File>[] = archives.map(file => ({
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
                    <Button
                        title={'🌈 Download Issue'}
                        onPress={() => {
                            download('noop' + Math.random())
                                .then(async () => {
                                    refreshIssues()
                                })
                                .catch(errorMessage => {
                                    Alert.alert(errorMessage)
                                })
                        }}
                    />
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
                {Object.keys(queue).length > 0 && (
                    <>
                        <ListHeading>Active downloads</ListHeading>
                        <List
                            data={Object.entries(queue).map(
                                ([key, { progress }]) => ({
                                    key,
                                    title: `${Math.ceil(
                                        progress * 100,
                                    )}% downloaded`,
                                    explainer: key,
                                }),
                            )}
                            onPress={() => {}}
                        />
                    </>
                )}
                <ListHeading>On device</ListHeading>
                <List
                    data={fileList}
                    onPress={({ type, path, issue }) => {
                        if (type === 'archive') {
                            unzipIssue(issue)
                                .then(async () => {
                                    refreshIssues()
                                })
                                .catch(error => {
                                    Alert.alert(error)
                                    refreshIssues()
                                })
                        } else {
                            Alert.alert('oof')
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
                                Alert.alert(issuesDir)
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
