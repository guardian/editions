import React from "react"
import {
  Platform,
  FlatList,
  TouchableHighlight,
  TouchableNativeFeedback,
  SafeAreaView,
  View,
  Text,
} from "react-native"

export class List extends React.Component<{
  data: any[]
  onPress: ({ key: any }) => void
}> {
  render() {
    const { data, onPress } = this.props
    const Highlight = Platform.OS === "android" ? TouchableNativeFeedback : TouchableHighlight
    return (
      <FlatList
        style={{
          borderTopWidth: 1,
          borderColor: "#ddd",
        }}
        data={data}
        renderItem={({ item: { title, ...item } }: any) => (
          <Highlight onPress={() => onPress(item)}>
            <View
              style={{
                padding: 16,
                paddingVertical: 24,
                backgroundColor: "#fff",
                borderBottomWidth: 1,
                borderColor: "#ddd",
              }}
            >
              <SafeAreaView>
                <Text>{title || "no title"}</Text>
              </SafeAreaView>
            </View>
          </Highlight>
        )}
      />
    )
  }
}
