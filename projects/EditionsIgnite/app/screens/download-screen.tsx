import React, { useState, useEffect } from "react"
import { ScrollView, Button, View } from "react-native"
import { List } from "../components/list"
import { NavigationScreenProp } from "react-navigation"
import RNFetchBlob from "rn-fetch-blob"

const issuesDir = `${RNFetchBlob.fs.dirs.CacheDir}/issues`

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
      <View style={{ flex: 0 }}>
        <Button
          title={`Download Firefox (${Math.ceil(progress * 100)}%)`}
          onPress={() => {
            RNFetchBlob.config({ fileCache: true })
              .fetch(
                "GET",
                `https://ftp.mozilla.org/pub/firefox/releases/45.0.2/linux-x86_64/as/firefox-45.0.2.tar.bz2?date=${Date.now()}`,
              )
              .progress((received, total) => {
                setProgress(received / total)
              })
              .then(res => {
                setProgress(1)
                refreshIssues()
                return RNFetchBlob.fs.mv(res.path(), `${issuesDir}/test-${Date.now()}.zip`)
              })
              .catch(errorMessage => {
                alert(errorMessage)
              })
          }}
        />
        <Button
          title="List stuff in issues"
          onPress={() => {
            alert(RNFetchBlob.fs.dirs.DocumentDir)
            refreshIssues()
          }}
        />
      </View>
      <ScrollView style={{ flex: 1 }}>
        <List
          data={files.map(file => ({ key: file, title: file }))}
          onPress={item => {
            RNFetchBlob.ios.openDocument(issuesDir + "/" + item.key)
          }}
        />
      </ScrollView>
    </View>
  )
}

DownloadScreen.navigationOptions = ({ navigation }) => ({
  title: "Downloads",
})
