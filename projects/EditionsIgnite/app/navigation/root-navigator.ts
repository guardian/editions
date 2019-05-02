import { createStackNavigator, createNavigationContainer } from "react-navigation"
import { HomeScreen } from "../screens/home"
import { IssueScreen } from "../screens/issue"
import { FrontScreen } from "../screens/front"
import { ArticleScreen } from "../screens/article"

export const RootNavigator = createNavigationContainer(
  createStackNavigator(
    {
      Home: HomeScreen,
      Issue: IssueScreen,
      Front: FrontScreen,
      Article: ArticleScreen,
    },
    {
      headerMode: "none",
      navigationOptions: { gesturesEnabled: false },
      initialRouteName: "Home",
    },
  ),
)
