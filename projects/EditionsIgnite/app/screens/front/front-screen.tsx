import React from "react"
import { ScrollView, StyleSheet, Text, View, Button } from "react-native"
import { MonoTextBlock } from "../../components/styled-text"
import { Grid } from "../../components/grid"
import { createFluidNavigator, Transition } from "react-navigation-fluid-transitions"
import { ArticleScreen } from "../article"
import { NavigationScreenProp } from "react-navigation"

class FrontScreen2 extends React.Component<{ navigation: NavigationScreenProp<{}> }> {
  static navigationOptions = () => ({
    navigation: null,
  })

  render() {
    const { navigation } = this.props
    const issue = navigation.getParam("issue", "NO-ID")
    const front = navigation.getParam("front", "NO-ID")
    return (
      <ScrollView style={styles.container} contentContainerStyle={styles.contentContainer}>
        <Grid
          to="Article"
          data={[
            {
              issue,
              front,
              article: "otter",
              key: "otter",
              title: "Otter story",
            },
            {
              issue,
              front,
              article: "brexit",
              key: "brexit",
              title: "Brexit story",
            },
          ]}
          {...{ navigation }}
        />
        <MonoTextBlock style={{ flex: 1 }}>
          This is an FrontScreen for from {front}, issue {issue}
        </MonoTextBlock>
      </ScrollView>
    )
  }
}

const Article = props => {
  return (
    <View>
      <Text>Screen 2</Text>
      <Transition shared="item-brexit">
        <View style={{ padding: 50, backgroundColor: "#f0f", margin: 16 }}>
          <Text>yolo</Text>
        </View>
      </Transition>

      <Button title="Back" onPress={() => props.navigation.goBack()} />
    </View>
  )
}

const Navigator = createFluidNavigator(
  {
    Home: FrontScreen2,
    Article: ArticleScreen,
  },
  {
    initialRouteName: "Home",
    transitionConfig: {
      duration: 300,
    },
  },
)

export class FrontScreen extends React.Component<{ navigation: NavigationScreenProp<{}> }> {
  static router = Navigator.router

  render() {
    const { navigation } = this.props
    return <Navigator navigation={navigation} />
  }
}

const styles = StyleSheet.create({
  container: {
    flex: 1,
    backgroundColor: "#fff",
  },
  contentContainer: {
    flex: 1,
    alignItems: "stretch",
  },
})
