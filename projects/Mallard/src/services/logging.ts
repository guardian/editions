// Logging Service that sends event logs to ELK
import NetInfo, { NetInfoStateType } from '@react-native-community/netinfo'
import { User } from '@sentry/react-native'
import { Platform } from 'react-native'
import DeviceInfo from 'react-native-device-info'
import { CASExpiry } from '../../../Apps/common/src/cas-expiry'
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
import { Level, Feature } from '../../../Apps/common/src/logging'

const { LOGGING_API_KEY } = Config

interface BaseLog {
    app: string
    timestamp: Date
    version: string
    buildNumber: string
    level: Level
    message: string
    release_channel: 'BETA' | 'RELEASE'
    os: 'android' | 'ios'
    device: string
    networkStatus: NetInfoStateType
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
    message: string
    optionalFields?: object
}

const getExternalInfo = async () => {
    const [networkStatus, userData, casCode, iapReceipt] = await Promise.all([
        NetInfo.fetch(),
        userDataCache.get(),
        getCASCode(),
        iapReceiptCache.get(),
    ])
    return {
        networkStatus,
        userData,
        casCode,
        iapReceipt,
    }
}

const baseLog = async ({
    level,
    message,
    ...optionalFields
}: LogParams): Promise<BaseLog> => {
    const {
        networkStatus,
        userData,
        casCode,
        iapReceipt,
    } = await privateFunctions.getExternalInfo()

    // User Data and Subscription
    const userId =
        (userData && userData.userDetails && userData.userDetails.id) || ''
    const digitalSub =
        (userData &&
            userData.membershipData &&
            userData.membershipData.contentAccess &&
            userData.membershipData.contentAccess.digitalPack) ||
        false
    const iAP = iapReceipt ? true : false

    return {
        app: DeviceInfo.getBundleId(),
        version: DeviceInfo.getVersion(),
        buildNumber: DeviceInfo.getBuildNumber(),
        os: Platform.OS === 'ios' ? 'ios' : 'android',
        device: DeviceInfo.getDeviceId(),
        networkStatus: networkStatus
            ? networkStatus.type
            : NetInfoStateType.unknown,
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
            return privateFunctions.saveQueuedLogs(logsToPost)
        }

        const postLogToService = await privateFunctions.postLog(logsToPost)
        await privateFunctions.clearLogs()
        return postLogToService
    } catch (e) {
        errorService.captureException(e)
        return e
    }
}

// Mocking hack as there are a load of external libraries
const privateFunctions = { getExternalInfo, saveQueuedLogs, clearLogs, postLog }

export { Level, Feature, log, baseLog, privateFunctions }
