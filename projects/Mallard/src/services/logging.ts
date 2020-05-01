// Logging Service that sends event logs to ELK
import AsyncStorage from '@react-native-community/async-storage'
import NetInfo, { NetInfoStateType } from '@react-native-community/netinfo'
import { User } from '@sentry/react-native'
import { Platform } from 'react-native'
import Config from 'react-native-config'
import DeviceInfo from 'react-native-device-info'
import { CASExpiry } from 'src/authentication/services/cas'
import { isInBeta } from 'src/helpers/release-stream'
import { defaultSettings } from 'src/helpers/settings/defaults'
import {
    casCredentialsKeychain,
    iapReceiptCache,
    legacyCASUsernameCache,
    userDataCache,
} from 'src/helpers/storage'
import { errorService } from './errors'

const LOG_QUEUE_KEY = '@logQueue'
const { LOGGING_API_KEY } = Config

enum Level {
    INFO = 'INFO',
    WARN = 'WARN',
    ERROR = 'ERROR',
    DEBUG = 'DEBUG',
}

/* Do we add this to help us filter in ELK? */
// enum Feature {
//     DOWNLOAD = 'DOWNLOAD',
//     PUSH_NOTIFICATION = 'PUSH_NOTIFICATION',
// }

interface BaseLog {
    app: string
    timestamp: Date
    version: string
    buildNumber: string
    level: Level
    message: object
    release_channel: 'BETA' | 'RELEASE'
    os: 'android' | 'ios'
    device: string
    network_status: NetInfoStateType
    // feature: Feature
    // May need to consent for the below
    deviceId: string
    signedIn: boolean
    userId: User['id'] | null
    digitalSub: boolean
    casCode: CASExpiry['subscriptionCode'] | null
    iAP: boolean
}

interface LogParams {
    level: Level
    message: object
    optionalFields?: object
}

// Make this external to call from several places
const getCASCode = () =>
    Promise.all([
        casCredentialsKeychain.get(),
        legacyCASUsernameCache.get(),
    ]).then(([current, legacy]) => (current && current.username) || legacy)

const baseLog = async ({
    level,
    message,
    ...optionalFields
}: LogParams): Promise<BaseLog> => {
    const network_status = await NetInfo.fetch()

    // User Data and Subscription
    const userData = await userDataCache.get()
    const userId =
        (userData && userData.userDetails && userData.userDetails.id) || ''
    const digitalSub =
        (userData &&
            userData.membershipData &&
            userData.membershipData.contentAccess &&
            userData.membershipData.contentAccess.digitalPack) ||
        false
    const casCode = await getCASCode()
    const iapReceipt = await iapReceiptCache.get()
    const iAP = iapReceipt ? true : false

    // Subscription Status need to be added?

    return {
        app: DeviceInfo.getBundleId(),
        version: DeviceInfo.getVersion(),
        buildNumber: DeviceInfo.getBuildNumber(),
        os: Platform.OS === 'ios' ? 'ios' : 'android',
        device: DeviceInfo.getDeviceId(),
        network_status: network_status.type,
        release_channel: isInBeta() ? 'BETA' : 'RELEASE',
        timestamp: new Date(),
        level,
        message,
        deviceId: DeviceInfo.getUniqueId(),
        signedIn: true, // WILL COME BACK TO THIS
        userId,
        digitalSub,
        casCode,
        iAP,
        ...optionalFields,
    }
}

const queueLogs = async (log: BaseLog[]) => {
    try {
        const currentQueueString = await AsyncStorage.getItem(LOG_QUEUE_KEY)
        const currentQueue = JSON.parse(currentQueueString || '[{}]')
        const newQueue = [...currentQueue, log]
        const newQueueString = JSON.stringify(newQueue)
        const updateQueue = await AsyncStorage.setItem(
            LOGGING_API_KEY,
            newQueueString,
        )
        return updateQueue
    } catch (e) {
        errorService.captureException(e)
    }
}

const getQueuedLogs = async () => {
    try {
        const logString = await AsyncStorage.getItem(LOGGING_API_KEY)
        return JSON.parse(logString || '[{}]')
    } catch (e) {
        // ?
    }
}

const clearLogs = async () => {
    try {
        return await AsyncStorage.removeItem(LOGGING_API_KEY)
    } catch (e) {
        errorService.captureException(e)
    }
}

const postLog = async (log: BaseLog[]): Promise<Response | Error> => {
    try {
        const response = await fetch(defaultSettings.logging, {
            method: 'POST',
            headers: {
                Accept: 'application/json',
                'Content-Type': 'application/json',
                apiKey: LOGGING_API_KEY,
            },
            body: JSON.stringify(log),
        })
        if (response.status !== 200) {
            throw new Error(
                `Bad response from Logging Service - status: ${response.status}`,
            )
        }
        return response
    } catch (e) {
        // Queue the log if it fails?
        queueLogs(log)
        return e
    }
}

const log = async ({
    level,
    message,
    ...optionalFields
}: LogParams): Promise<Response | Error> => {
    try {
        const currentLog = await baseLog({ level, message, ...optionalFields })
        const queuedLogs = await getQueuedLogs()
        const logsToPost = [...queuedLogs, currentLog]
        const cleanLogs = logsToPost.filter(
            value => Object.keys(value).length !== 0,
        )
        const postLogToService = await postLog(cleanLogs)
        await clearLogs()
        return postLogToService
    } catch (e) {
        errorService.captureException(e)
        return e
    }
}

// TASK 3
// Manage offline when sending logs
/*
Offline considerations:
 - What do do when going offine
 - What to do when they come back online
 - Cleanup when successful logging queue has been processed
 - How do we manage different status codes coming back from logging service (and online)

 Async storage cache helpers/storage
 -- offline
 -- get from async cache
 -- append to end
 -- set in async cache
 -- loop while offline
 -- online? send logs
 -- success? reset cache

 -- look to keep last 100 logs?

*/
//

export { Level, log }
