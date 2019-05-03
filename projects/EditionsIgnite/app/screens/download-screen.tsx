import React, { useState, useEffect } from "react"
import { ScrollView, Button, Text, View, Alert, SafeAreaView } from "react-native"
import { List } from "../components/list"
import { NavigationScreenProp } from "react-navigation"
import RNFetchBlob from "rn-fetch-blob"
import { color } from "../theme/color"

const issuesDir = `${RNFetchBlob.fs.dirs.DocumentDir}/issues`

/*
 TODO: for now it's cool to fail this silently, BUT it means that either folder exists already (yay! we want that) or that something far more broken is broken (no thats bad)
 */
const makeCacheFolder = () => RNFetchBlob.fs.mkdir(issuesDir).catch(() => Promise.resolve())

const rebuildCacheFolder = async () => {
  await RNFetchBlob.fs.unlink(issuesDir)
  await makeCacheFolder()
}

export const DownloadScreen = ({ navigation }: { navigation: NavigationScreenProp<{}> }) => {
  const [files, setFiles] = useState([])
  const [progress, setProgress] = useState(0)

  const refreshIssues = () =>
    RNFetchBlob.fs.ls(issuesDir).then(files => {
      setFiles(files)
    })

  useEffect(() => {
    refreshIssues()
  }, [])

  return (
    <View style={{ flex: 1 }}>
      <ScrollView style={{ flex: 1 }}>
        <View
          style={{
            flex: 0,
            alignItems: "center",
            justifyContent: "center",
            padding: 16,
            height: 80,
            backgroundColor: color.dimBackground,
          }}
        >
          {progress > 0 ? (
            <Text>{`Downloading (${Math.ceil(progress * 100)}%)`}</Text>
          ) : (
            <Button
              title={"🤩 Download Zip 👋"}
              onPress={async () => {
                RNFetchBlob.config({
                  fileCache: true,
                })
                  .fetch(
                    "GET",
                    `https://ftp.mozilla.org/pub/firefox/releases/45.0.2/linux-x86_64/as/firefox-45.0.2.tar.bz2?date=${Date.now()}`,
                  )
                  .progress((received, total) => {
                    setProgress(received / total)
                  })
                  .then(async res => {
                    await makeCacheFolder()
                    await RNFetchBlob.fs.mv(res.path(), `${issuesDir}/test-${Date.now()}.zip`)
                    setProgress(0)
                    refreshIssues()
                  })
                  .catch(errorMessage => {
                    alert(errorMessage)
                  })
              }}
            />
          )}
        </View>
        <List
          data={files.map(file => ({ key: file, title: file }))}
          onPress={item => {
            RNFetchBlob.ios.openDocument(issuesDir + "/" + item.key)
            RNFetchBlob.android.addCompleteDownload({
              title: item.key,
              description: "desc",
              mime: "data/zip",
              path: issuesDir + "/" + item.key,
              showNotification: true,
            })
          }}
        />
      </ScrollView>
      <SafeAreaView
        style={{
          flexDirection: "row",
          alignItems: "stretch",
          justifyContent: "center",
          borderColor: color.line,
          borderTopWidth: 1,
        }}
      >
        <View style={{ margin: 10 }}>
          <Button
            title="Refresh list"
            onPress={() => {
              alert(RNFetchBlob.fs.dirs.DocumentDir)
              refreshIssues()
            }}
          />
        </View>
        <View style={{ margin: 10 }}>
          <Button
            title="Wipe cache"
            onPress={() => {
              Alert.alert(
                "Delete cache",
                "Ya sure lass?",
                [
                  {
                    text: "Don't delete it",
                  },
                  {
                    text: "AWAY WITH IT",
                    style: "cancel",
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
      </SafeAreaView>
    </View>
  )
}

DownloadScreen.navigationOptions = ({ navigation }) => ({
  title: "Downloads",
})
