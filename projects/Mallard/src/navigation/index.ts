import { createStackNavigator, createAppContainer } from 'react-navigation'
import { HomeScreen } from '../screens/home-screen'
import { FrontScreen } from '../screens/front-screen'
import { ArticleScreen } from '../screens/article-screen'
import { SettingsScreen } from '../screens/settings-screen'
import { DownloadScreen } from '../screens/settings/download-screen'
import { ApiScreen } from '../screens/settings/api-screen'
import { color } from '../theme/color'

export const RootNavigator = createAppContainer(
    createStackNavigator(
        {
            Main: createStackNavigator(
                {
                    Home: HomeScreen,
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
            transparentCard: true,
            initialRouteName: 'Main',
            mode: 'modal',
            headerMode: 'none',
            cardOverlayEnabled: true,
            defaultNavigationOptions: {
                gesturesEnabled: false,
            },
        },
    ),
)
