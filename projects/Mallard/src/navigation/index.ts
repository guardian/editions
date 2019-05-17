import { createStackNavigator, createAppContainer } from 'react-navigation'
import { HomeScreen } from '../screens/home-screen'
import { IssueScreen } from '../screens/issue-screen'
import { FrontScreen } from '../screens/front-screen'
import { ArticleScreen } from '../screens/article-screen'
import { SettingsScreen } from '../screens/settings-screen'
import { DownloadScreen } from '../screens/settings/download-screen'
import { ApiScreen } from '../screens/settings/api-screen'
import { color } from '../theme/color'
import { createFluidNavigator } from 'react-navigation-fluid-transitions'

export const RootNavigator = createAppContainer(
    createFluidNavigator(
        {
            Main: createStackNavigator(
                {
                    Home: HomeScreen,
                    Issue: IssueScreen,
                    Front: FrontScreen,
                    Downloads: DownloadScreen,
                    Settings: SettingsScreen,
                    Endpoints: ApiScreen,
                },
                {
                    defaultNavigationOptions: {
                        headerStyle: {
                            backgroundColor: color.primary,
                        },
                        headerTintColor: color.textOverPrimary,
                    },
                    initialRouteName: 'Home',
                },
            ),
            Article: ArticleScreen,
        },
        {
            initialRouteName: 'Main',
            transitionConfig: {
                duration: 300,
            },
            defaultNavigationOptions: {
                gesturesEnabled: false,
            },
        },
    ),
)
