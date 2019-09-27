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
import NetInfo from '@react-native-community/netinfo'
import { isInBeta } from './release-stream'
import { Platform, Linking } from 'react-native'
import {
    IOS_BETA_EMAIL,
    ANDROID_BETA_EMAIL,
    DIAGNOSTICS_REQUEST,
} from './words'
import { runActionSheet } from './action-sheet'
import { legacyCASUsernameCache, casCredentialsKeychain } from './storage'
import RNFetchBlob from 'rn-fetch-blob'
import { FSPaths } from 'src/paths'

const getCASCode = () =>
    Promise.all([
        casCredentialsKeychain.get(),
        legacyCASUsernameCache.get(),
    ]).then(([current, legacy]) => (current && current.username) || legacy)

const getGDPREntries = () =>
    Promise.all(
        gdprSwitchSettings.map(
            async setting => [setting, await getSetting(setting)] as const,
        ),
    )

const getDiagnosticInfo = async (authStatus: AuthStatus) => {
    const [netInfo, gdprEntries, casCode] = await Promise.all([
        NetInfo.fetch(),
        getGDPREntries(),
        getCASCode(),
    ])
    const folderStat = await RNFetchBlob.fs.stat(FSPaths.issuesDir)
    const size = parseInt(folderStat.size)
    const bytes = size
    const kilobytes = bytes / 1000
    const megabytes = kilobytes / 1000
    const gigabytes = megabytes / 1000

    return `

The information below will help us to better understand your query:

-App-
Product: Daily App
App Version: ${DeviceInfo.getVersion()} ${DeviceInfo.getBuildNumber()}
Commit id: ${getVersionInfo().commitId}
Release Channel: ${isInBeta() ? 'BETA' : 'RELEASE'}
App Edition: UK
First app start: ${DeviceInfo.getFirstInstallTime()}
Last updated: ${DeviceInfo.getLastUpdateTime()}

-Device-
${Platform.OS} Version: ${Platform.Version}
Device Type: ${DeviceInfo.getDeviceId()}
Device Locale: ${DeviceInfo.getDeviceCountry()}
Timezone: ${DeviceInfo.getTimezone()}
Network availability: ${netInfo.type}
Privacy settings: ${gdprEntries
        .map(([key, value]) => `${key}:${value}`)
        .join(' ')}
Editions Data Folder Size: ${bytes}B / ${kilobytes}KB / ${megabytes}MB / ${gigabytes}GB
Total Disk Space: ${DeviceInfo.getTotalDiskCapacity()}
Available Disk Spce: ${DeviceInfo.getFreeDiskStorage()}

-User / Supporter Info-
Signed In: ${isAuthed(authStatus)}
Digital Pack subscription: ${isIdentity(authStatus)}
Apple IAP Transaction Details: ${isIAP(authStatus) &&
        `\n${JSON.stringify(authStatus.data.info, null, 2)}`}
Subscriber ID: ${isCAS(authStatus) && casCode}
`
}

const openSupportMailto = (text: string, releaseURL: string, body?: string) => {
    const email = Platform.select({
        ios: isInBeta() ? IOS_BETA_EMAIL : releaseURL,
        android: isInBeta() ? ANDROID_BETA_EMAIL : releaseURL,
    })

    const subject = `${text} - ${
        Platform.OS
    } Daily App, ${DeviceInfo.getVersion()} ${DeviceInfo.getBuildNumber()}`

    return Linking.openURL(
        `mailto:${email}?subject=${encodeURIComponent(subject)}${
            body ? `&body=${encodeURIComponent(body)}` : ''
        }`,
    )
}

const createMailtoHandler = (
    text: string,
    releaseURL: string,
    authStatus: AuthStatus,
) => () =>
    runActionSheet(DIAGNOSTICS_REQUEST, [
        {
            text: 'Include',
            onPress: async () => {
                const diagnostics = await getDiagnosticInfo(authStatus)
                openSupportMailto(text, releaseURL, diagnostics)
            },
        },
        {
            text: `Don't include`,
            onPress: () => openSupportMailto(text, releaseURL),
        },
    ])

const createSupportMailto = (
    text: string,
    releaseURL: string,
    authStatus: AuthStatus,
) => ({
    key: text,
    title: text,
    linkWeight: 'regular' as const,
    data: {
        onPress: createMailtoHandler(text, releaseURL, authStatus),
    },
})

export { createSupportMailto, createMailtoHandler }
