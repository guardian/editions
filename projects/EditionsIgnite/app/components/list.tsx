import React from "react"
import {
  Platform,
  FlatList,
  TouchableHighlight,
  TouchableNativeFeedback,
  View,
  Text,
} from "react-native"
import { NavigationScreenProp } from "react-navigation"

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
              <Text>{title || "no title"}</Text>
            </View>
          </Highlight>
        )}
      />
    )
  }
}
