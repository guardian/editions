import { createStackNavigator, createAppContainer } from "react-navigation"
import { HomeScreen } from "../screens/home"
import { IssueScreen } from "../screens/issue"
import { FrontScreen } from "../screens/front"
import { ArticleScreen } from "../screens/article"

export const RootNavigator = createAppContainer(
  createStackNavigator(
    {
      Home: HomeScreen,
      Issue: IssueScreen,
      Front: FrontScreen,
      Article: ArticleScreen,
    },
    {
      defaultNavigationOptions: {
        headerStyle: {
          backgroundColor: "#052962",
        },
        headerTintColor: "#fff",
      },
      initialRouteName: "Home",
    },
  ),
)
