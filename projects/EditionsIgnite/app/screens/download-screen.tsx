import React, { useState, useEffect } from "react"
import { ScrollView, Button, Text, View, Alert, SafeAreaView } from "react-native"
import { List } from "../components/list"
import { NavigationScreenProp } from "react-navigation"
import RNFetchBlob from "rn-fetch-blob"
import { color } from "../theme/color"

const issuesDir = `${RNFetchBlob.fs.dirs.DocumentDir}/issues`

export const DownloadScreen = ({ navigation }: { navigation: NavigationScreenProp<{}> }) => {
  const [files, setFiles] = useState([])
  const [progress, setProgress] = useState(0)

  const refreshIssues = () =>
    RNFetchBlob.fs.ls(issuesDir).then(files => {
      setFiles(files)
    })

  const rebuildCacheFolder = async () => {
    await RNFetchBlob.fs.unlink(issuesDir)
    try {
      await RNFetchBlob.fs.mkdir(issuesDir)
    } catch {}
  }

  useEffect(() => {
    refreshIssues()
  }, [])

  return (
    <View style={{ flex: 1 }}>
      <View style={{ flex: 0, padding: 20, height: 80, backgroundColor: color.dim }}>
        {progress > 0 ? (
          <Text style={{ textAlign: "center" }}>{`Downloading (${Math.ceil(
            progress * 100,
          )}%)`}</Text>
        ) : (
          <Button
            title={"🤩 Download Zip 👋"}
            onPress={async () => {
              RNFetchBlob.config({ fileCache: true })
                .fetch(
                  "GET",
                  `https://ftp.mozilla.org/pub/firefox/releases/45.0.2/linux-x86_64/as/firefox-45.0.2.tar.bz2?date=${Date.now()}`,
                )
                .progress((received, total) => {
                  setProgress(received / total)
                })
                .then(async res => {
                  try {
                    await RNFetchBlob.fs.mkdir(issuesDir)
                  } catch {}
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
      <ScrollView style={{ flex: 1 }}>
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
        style={{ flexDirection: "row", alignItems: "stretch", justifyContent: "center" }}
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
