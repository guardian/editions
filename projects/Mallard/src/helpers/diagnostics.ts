import {
    gdprSwitchSettings,
    getSetting,
    getVersionInfo,
} from 'src/helpers/settings'
import DeviceInfo from 'react-native-device-info'
import {
    AuthStatus,
    isAuthed,
    isIdentity,
    isIAP,
    isCAS,
} from 'src/authentication/credentials-chain'
import Permissions from 'react-native-permissions'
import NetInfo from '@react-native-community/netinfo'
import { isInBeta } from './release-stream'
import { Platform, ActionSheetIOS, Linking, Alert } from 'react-native'
import {
    IOS_BETA_EMAIL,
    ANDROID_BETA_EMAIL,
    DIAGNOSTICS_REQUEST,
} from './words'

const getDiagnosticInfo = (authStatus: AuthStatus) =>
    Promise.all([
        NetInfo.fetch(),
        Permissions.checkMultiple(['notification']),
        Promise.all(
            gdprSwitchSettings.map(
                async setting => [setting, await getSetting(setting)] as const,
            ),
        ),
    ]).then(
        ([netInfo, response, gdprEntries]) => `

The information below will help us to better understand your query:

-App-
Product: Daily App
App Version: ${DeviceInfo.getVersion()} ${DeviceInfo.getBuildNumber()}
Release Channel: ${isInBeta() ? 'BETA' : 'RELEASE'}
App Edition: UK
First app start: ${DeviceInfo.getFirstInstallTime()}
Last updated: ${DeviceInfo.getLastUpdateTime()}

-Device-
${Platform.OS} Version: ${Platform.Version}
Device Type: ${DeviceInfo.getDeviceId()}
Notifications Permissions Enabled: ${response.notification}
Device Locale: ${DeviceInfo.getDeviceCountry()}
Timezone: ${DeviceInfo.getTimezone()}
Network availability: ${netInfo.type}
Privacy settings: ${gdprEntries
            .map(([key, value]) => `${key}:${value}`)
            .join(' ')}

-User / Supporter Info-
Signed In: ${isAuthed(authStatus)}
Digital Pack subscription: ${isAuthed(authStatus) &&
            isIdentity(authStatus.data)}
Apple IAP Transaction Details: ${isAuthed(authStatus) &&
            isIAP(authStatus.data) &&
            `\n${JSON.stringify(authStatus.data.info, null, 2)}`}
Subscriber ID: ${isAuthed(authStatus) &&
            isCAS(authStatus.data) &&
            authStatus.data.info.subscriptionCode}
`,
    )

const supportMailToURL = (text: string, releaseURL: string, body?: string) => {
    const email = Platform.select({
        ios: isInBeta() ? releaseURL : IOS_BETA_EMAIL,
        android: isInBeta() ? releaseURL : ANDROID_BETA_EMAIL,
    })

    const subject = `${text} - ${
        Platform.OS
    } Daily App, ${DeviceInfo.getVersion()} / ${getVersionInfo().commitId}`

    return `mailto:${email}?subject=${encodeURIComponent(subject)}${body &&
        `&body=${encodeURIComponent(body)}`}`
}

const createSupportMailTo = (
    text: string,
    release: string,
    authStatus: AuthStatus,
) => ({
    key: text,
    title: text,
    data: {
        onPress: async () => {
            Platform.select({
                ios: () =>
                    ActionSheetIOS.showActionSheetWithOptions(
                        {
                            options: ['Include', `Don't include`],
                            message: DIAGNOSTICS_REQUEST,
                        },
                        async index => {
                            Linking.openURL(
                                supportMailToURL(
                                    text,
                                    release,
                                    index === 0
                                        ? await getDiagnosticInfo(authStatus)
                                        : undefined,
                                ),
                            )
                        },
                    ),
                android: () =>
                    Alert.alert(DIAGNOSTICS_REQUEST, undefined, [
                        {
                            text: 'Include',
                            onPress: async () => {
                                Linking.openURL(
                                    supportMailToURL(
                                        text,
                                        release,
                                        await getDiagnosticInfo(authStatus),
                                    ),
                                )
                            },
                        },
                        {
                            text: `Don't include`,
                            onPress: () => {
                                Linking.openURL(supportMailToURL(text, release))
                            },
                        },
                    ]),
            })()
        },
    },
})

export { createSupportMailTo }
