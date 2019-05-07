import { createStackNavigator, createAppContainer } from "react-navigation"
import { HomeScreen } from "../screens/home-screen"
import { IssueScreen } from "../screens/issue-screen"
import { FrontScreen } from "../screens/front-screen"
import { DownloadScreen } from "../screens/download-screen"
import { color } from "../theme/color"

export const RootNavigator = createAppContainer(
  createStackNavigator(
    {
      Home: HomeScreen,
      Issue: IssueScreen,
      Front: FrontScreen,
      Downloads: DownloadScreen,
    },
    {
      defaultNavigationOptions: {
        headerStyle: {
          backgroundColor: color.primary,
        },
        headerTintColor: color.textOverPrimary,
      },
      initialRouteName: "Home",
    },
  ),
)
