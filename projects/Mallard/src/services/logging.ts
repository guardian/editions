// Logging Service that sends event logs to ELK
import NetInfo, { NetInfoStateType } from '@react-native-community/netinfo'
import { User } from '@sentry/react-native'
import { Platform } from 'react-native'
import DeviceInfo from 'react-native-device-info'
import { CASExpiry } from 'src/authentication/services/cas'
import { isInBeta } from 'src/helpers/release-stream'
import { defaultSettings } from 'src/helpers/settings/defaults'
import {
    iapReceiptCache,
    userDataCache,
    loggingQueueCache,
} from 'src/helpers/storage'
import { errorService } from './errors'
import { getCASCode } from 'src/authentication/helpers'
import Config from 'react-native-config'

const { LOGGING_API_KEY } = Config

enum Level {
    INFO = 'INFO',
    WARN = 'WARN',
    ERROR = 'ERROR',
    DEBUG = 'DEBUG',
}

enum Feature {
    DOWNLOAD = 'DOWNLOAD',
    PUSH_NOTIFICATION = 'PUSH_NOTIFICATION',
    BACKGROUNG_DOWNLOAD = 'BACKGROUND_DOWNLOAD',
    CLEAR_ISSUES = 'CLEAR_ISSUES',
}

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
    // May need to consent for the below
    deviceId: string
    signedIn: boolean
    userId: User['id'] | null
    digitalSub: boolean
    casCode: CASExpiry['subscriptionCode'] | null
    iAP: boolean
    feature?: Feature
}

interface LogParams {
    level: Level
    message: object
    optionalFields?: object
}

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
        signedIn: userData ? true : false,

        userId,
        digitalSub,
        casCode,
        iAP,
        ...optionalFields,
    }
}

const getQueuedLogs = async (): Promise<BaseLog[] | [{}]> => {
    try {
        const logString = await loggingQueueCache.get()
        return JSON.parse(logString || '[{}]')
    } catch (e) {
        return [{}]
    }
}

const saveQueuedLogs = async (log: BaseLog[]): Promise<string | Error> => {
    try {
        const logString = JSON.stringify(log)
        await loggingQueueCache.set(logString)
        return 'saved logs'
    } catch (e) {
        errorService.captureException(e)
        throw new Error(e)
    }
}

const queueLogs = async (log: BaseLog[]) => {
    try {
        const currentQueue = await getQueuedLogs()
        const currentQueueString = JSON.stringify(currentQueue)
        const parsedQueue = JSON.parse(currentQueueString || '[{}]')
        const newQueue = [...parsedQueue, ...log]
        const cleanLogs = newQueue.filter(
            value => Object.keys(value).length !== 0,
        )
        return cleanLogs
    } catch (e) {
        errorService.captureException(e)
        throw new Error(e)
    }
}

const clearLogs = async () => {
    try {
        return await loggingQueueCache.reset()
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
        saveQueuedLogs(log)
        throw new Error(e)
    }
}

const log = async ({ level, message, ...optionalFields }: LogParams) => {
    try {
        const currentLog = await baseLog({ level, message, ...optionalFields })
        const logsToPost = await queueLogs([currentLog])

        const { isConnected } = await NetInfo.fetch()
        // Not connected, save the log queue
        if (!isConnected) {
            return saveQueuedLogs(logsToPost)
        }

        const postLogToService = await postLog(logsToPost)
        await clearLogs()
        return postLogToService
    } catch (e) {
        errorService.captureException(e)
        return e
    }
}

// Do we always want to queue the logs no matter what?

// TODO
// - Tests
// - Docs?

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

export { Level, Feature, log }
