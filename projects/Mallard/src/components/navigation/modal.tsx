import React, {
    useContext,
    ReactElement,
    ReactNode,
    FunctionComponent,
} from 'react'
import { Text, Dimensions, View, Alert, StyleSheet } from 'react-native'
import AsyncStorage from '@react-native-community/async-storage'

import { List } from 'src/components/lists/list'
import {
    withNavigation,
    NavigationInjectedProps,
    NavigationScreenProp,
    createStackNavigator,
    NavigationRouter,
    NavigationContainer,
} from 'react-navigation'
import { useSettings } from 'src/hooks/use-settings'
import { UiBodyCopy } from 'src/components/styled-text'
import { Highlight } from 'src/components/highlight'
import { APP_DISPLAY_NAME, FEEDBACK_EMAIL } from 'src/helpers/words'
import { clearCache } from 'src/helpers/fetch/cache'
import { Heading, Footer } from 'src/components/layout/ui/row'
import { getVersionInfo } from 'src/helpers/settings'
import { metrics } from 'src/theme/spacing'
import { ScrollContainer } from 'src/components/layout/ui/container'
import { Button } from 'src/components/button/button'
import { WithAppAppearance } from 'src/theme/appearance'
import {
    useIdentity,
    AuthContext,
    useAuth,
} from 'src/authentication/auth-context'
import { RightChevron } from 'src/components/icons/RightChevron'
import { getFont } from 'src/theme/typography'
import { color } from 'src/theme/color'
import { DownloadScreen } from './settings/download-screen'
import { ApiScreen } from './settings/api-screen'
import { GdprConsentScreen } from './settings/gdpr-consent-screen'
import { PrivacyPolicyScreen } from './settings/privacy-policy-screen'
import { TermsAndConditionsScreen } from './settings/terms-and-conditions-screen'
import { HelpScreen } from './settings/help-screen'
import { CreditsScreen } from './settings/credits-screen'
import { FAQScreen } from './settings/faq-screen'
import { routeNames } from 'src/navigation/routes'
import { SettingsScreenIndex } from './settings'
import { WithBreakpoints } from 'src/components/layout/ui/with-breakpoints'
import { Breakpoints } from 'src/theme/breakpoints'
import { NavigationRouteConfigMap } from 'react-navigation';

const ModalForTablet = ({ children }: { children: ReactNode }) => {
    return (
        <View
            style={{
                alignContent: 'stretch',
                justifyContent: 'center',
                alignItems: 'stretch',
                height: '100%',
                width: '100%',
                flex: 1,
                backgroundColor: 'rgba(52, 52, 52, .5)',
            }}
        >
            <WithBreakpoints>
                {{
                    [0]: () => (
                        <View
                            style={{
                                flexGrow: 1,
                                alignItems: 'stretch',
                                justifyContent: 'flex-end',
                                backgroundColor: 'blue',
                                height: '100%',
                                width: '100%',
                            }}
                        >
                            {children}
                        </View>
                    ),
                    [Breakpoints.tabletVertical]: () => (
                        <View
                            style={{
                                flex: 1,
                                alignItems: 'center',
                                justifyContent: 'center',
                            }}
                        >
                            <View
                                style={{
                                    width: 400,
                                    height: 600,
                                    backgroundColor: 'red',
                                }}
                            >
                                {children}
                            </View>
                        </View>
                    ),
                }}
            </WithBreakpoints>
        </View>
    )
}

const SettingsNavigator = createStackNavigator({
    ['Main']: SettingsScreenIndex,
    [routeNames.Downloads]: DownloadScreen,
    [routeNames.Endpoints]: ApiScreen,
    [routeNames.GdprConsent]: GdprConsentScreen,
    [routeNames.PrivacyPolicy]: PrivacyPolicyScreen,
    [routeNames.TermsAndConditions]: TermsAndConditionsScreen,
    [routeNames.Help]: HelpScreen,
    [routeNames.Credits]: CreditsScreen,
    [routeNames.FAQ]: FAQScreen,
})

const SettingsScreen = (withNavigation(
    ({ navigation, ...props }: NavigationInjectedProps) => {
        console.log(navigation, props)
        return (
            <ModalForTablet>
                <SettingsNavigator navigation={navigation} />
            </ModalForTablet>
        )
    },
) as unknown) as NavigationContainer
SettingsScreen.router = SettingsNavigator.router

export { SettingsScreen }

const createModalNavigator = (routes: NavigationRouteConfigMap)
