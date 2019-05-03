import React from "react"
import { Text, View } from "react-native"

export class MonoText extends React.Component<{ style?: any }> {
  render() {
    return <Text {...this.props} style={[this.props.style]} />
  }
}

export class MonoTextBlock extends React.Component<{ style?: any }> {
  render() {
    return (
      <View
        style={[
          this.props.style,
          {
            padding: 16,
          },
        ]}
      >
        <MonoText style={{ textAlign: "center", textAlignVertical: "center" }} {...this.props} />
      </View>
    )
  }
}
