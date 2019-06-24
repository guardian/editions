import React from 'react'
import { createStackNavigator, createAppContainer } from 'react-navigation'
import { HomeScreen } from '../screens/home-screen'
import { IssueScreen } from '../screens/issue-screen'
import { ArticleScreen } from '../screens/article-screen'
import { SettingsScreen } from '../screens/settings-screen'
import { DownloadScreen } from '../screens/settings/download-screen'
import { ApiScreen } from '../screens/settings/api-screen'
import { color } from 'src/theme/color'
import { Animated, Easing } from 'react-native'
import { issueToArticleScreenInterpolator } from './interpolators'
import { useSettings } from 'src/hooks/use-settings'
import { OnboardingHandler } from 'src/onboarding'

const RootContainer = createAppContainer(
    createStackNavigator(
        {
            Main: createStackNavigator(
                {
                    Home: HomeScreen,
                    Issue: IssueScreen,
                    Downloads: DownloadScreen,
                    Settings: SettingsScreen,
                    Endpoints: ApiScreen,
                },
                {
                    defaultNavigationOptions: {
                        headerStyle: {
                            backgroundColor: color.palette.brand.dark,
                            borderBottomColor: color.text,
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
            transitionConfig: () => ({
                containerStyle: {
                    backgroundColor: 'transparent',
                },
                transitionSpec: {
                    duration: 300,
                    easing: Easing.quad,
                    timing: Animated.timing,
                    useNativeDriver: true,
                },
                screenInterpolator: issueToArticleScreenInterpolator,
            }),
            defaultNavigationOptions: {
                gesturesEnabled: false,
            },
        },
    ),
)

const RootNavigator = ({
    persistenceKey,
}: {
    persistenceKey: string | null
}) => {
    const [settings, setSetting] = useSettings()

    return settings.hasOnboarded ? (
        <RootContainer persistenceKey={persistenceKey} />
    ) : (
        <OnboardingHandler
            onComplete={() => setSetting('hasOnboarded', true)}
        />
    )
}

export { RootNavigator }
