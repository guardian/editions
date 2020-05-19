import ApolloClient from 'apollo-client'
import gql from 'graphql-tag'
import { Linking, Platform } from 'react-native'
import DeviceInfo from 'react-native-device-info'
import RNFetchBlob from 'rn-fetch-blob'
import { canViewEdition, getCASCode } from 'src/authentication/helpers'
import { AnyAttempt, isValid } from 'src/authentication/lib/Attempt'
import { gdprSwitchSettings, getSetting } from 'src/helpers/settings'
import { NetInfo } from 'src/hooks/use-net-info'
import { FSPaths } from 'src/paths'
import { runActionSheet } from './action-sheet'
import { getFileList } from './files'
import { locale } from './locale'
import { getDiagnosticPushTracking } from '../push-notifications/push-tracking'
import { isInBeta } from './release-stream'
import { imageForScreenSize } from './screen'
import { iapReceiptCache, userDataCache } from './storage'
import {
    ANDROID_BETA_EMAIL,
    DIAGNOSTICS_REQUEST,
    DIAGNOSTICS_TITLE,
    IOS_BETA_EMAIL,
} from './words'

const getGDPREntries = () =>
    Promise.all(
        gdprSwitchSettings.map(
            async setting => [setting, await getSetting(setting)] as const,
        ),
    )

const getDiagnosticInfo = async (
    client: ApolloClient<object>,
    authAttempt: AnyAttempt<string>,
) => {
    const [
        netInfoResult,
        gdprEntries,
        casCode,
        idData,
        receiptData,
    ] = await Promise.all([
        client.query<{ netInfo: NetInfo }>({
            query: gql`
                {
                    netInfo @client {
                        type @client
                        isConnected @client
                        details @client
                    }
                }
            `,
        }),
        getGDPREntries(),
        getCASCode(),
        userDataCache.get(),
        iapReceiptCache.get(),
    ])
    const netInfo = netInfoResult.data.netInfo

    const folderStat = await RNFetchBlob.fs.stat(FSPaths.issuesDir)
    const size = parseInt(folderStat.size)
    const bytes = size
    const kilobytes = bytes / 1000
    const megabytes = kilobytes / 1000
    const gigabytes = megabytes / 1000
    const buildNumber = DeviceInfo.getBuildNumber()
    const version = DeviceInfo.getVersion()
    const deviceId = DeviceInfo.getDeviceId()

    const [
        firstInstallTime,
        lastUpdateTime,
        totalDiskCapacity,
        freeDiskStorage,
        fileList,
        imageSize,
        pushTracking,
    ] = await Promise.all([
        DeviceInfo.getFirstInstallTime(),
        DeviceInfo.getLastUpdateTime(),
        DeviceInfo.getTotalDiskCapacity(),
        DeviceInfo.getFreeDiskStorage(),
        getFileList(),
        imageForScreenSize(),
        getDiagnosticPushTracking(),
    ])

    return `

The information below will help us to better understand your query:

-App-
Product: Daily App
App Version: ${version} ${buildNumber}
Release Channel: ${isInBeta() ? 'BETA' : 'RELEASE'}
App Edition: UK
Locale: ${locale}
First app start: ${firstInstallTime}
Last updated: ${lastUpdateTime}
Image Size for Downloads: ${imageSize}

-Device-
${Platform.OS} Version: ${Platform.Version}
Device Type: ${deviceId}
Network availability: ${netInfo.type}
Privacy settings: ${gdprEntries
        .map(([key, value]) => `${key}:${value}`)
        .join(' ')}
Editions Data Folder Size: ${bytes}B / ${kilobytes}KB / ${megabytes}MB / ${gigabytes}GB
Total Disk Space: ${totalDiskCapacity}
Available Disk Spce: ${freeDiskStorage}
Issues on device: ${fileList && JSON.stringify(fileList, null, 2)}

-User / Supporter Info-
Signed In: ${isValid(authAttempt)}
Digital Pack subscription: ${idData && canViewEdition(idData)}
Apple IAP Transaction Details: ${receiptData &&
        `\n${JSON.stringify(receiptData, null, 2)}`}
Subscriber ID: ${casCode}

-Push Downloads-
${pushTracking && JSON.stringify(pushTracking, null, 2)}
`
}

const openSupportMailto = async (
    text: string,
    releaseURL: string,
    body?: string,
) => {
    const email = Platform.select({
        ios: isInBeta() ? IOS_BETA_EMAIL : releaseURL,
        android: isInBeta() ? ANDROID_BETA_EMAIL : releaseURL,
    })

    const version = DeviceInfo.getVersion()
    const buildNumber = DeviceInfo.getBuildNumber()

    const subject = `${text} - ${Platform.OS} Daily ${
        isInBeta() ? 'Beta' : ''
    } App, ${version} ${buildNumber}`

    return Linking.openURL(
        `mailto:${email}?subject=${encodeURIComponent(subject)}${
            body ? `&body=${encodeURIComponent(body)}` : ''
        }`,
    )
}

const createMailtoHandler = (
    client: ApolloClient<object>,
    text: string,
    releaseURL: string,
    authAttempt: AnyAttempt<string>,
) => () =>
    runActionSheet(DIAGNOSTICS_TITLE, DIAGNOSTICS_REQUEST, [
        {
            text: 'Include',
            onPress: async () => {
                const diagnostics = await getDiagnosticInfo(client, authAttempt)
                openSupportMailto(text, releaseURL, diagnostics)
            },
        },
        {
            text: `Don't include`,
            onPress: () => openSupportMailto(text, releaseURL),
        },
    ])

const createSupportMailto = (
    client: ApolloClient<object>,
    text: string,
    releaseURL: string,
    authAttempt: AnyAttempt<string>,
) => ({
    key: text,
    title: text,
    linkWeight: 'regular' as const,
    onPress: createMailtoHandler(client, text, releaseURL, authAttempt),
})

export { createSupportMailto, createMailtoHandler }
