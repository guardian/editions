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

class Logging {
    async getExternalInfo() {
        const [
            networkStatus,
            userData,
            casCode,
            iapReceipt,
        ] = await Promise.all([
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

    async baseLog({
        level,
        message,
        ...optionalFields
    }: LogParams): Promise<BaseLog> {
        const {
            networkStatus,
            userData,
            casCode,
            iapReceipt,
        } = await this.getExternalInfo()

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

    async getQueuedLogs(): Promise<BaseLog[] | [{}]> {
        try {
            const logString = await loggingQueueCache.get()
            return JSON.parse(logString || '[{}]')
        } catch (e) {
            return [{}]
        }
    }

    async saveQueuedLogs(log: BaseLog[]): Promise<string | Error> {
        try {
            const logString = JSON.stringify(log)
            await loggingQueueCache.set(logString)
            return 'saved logs'
        } catch (e) {
            errorService.captureException(e)
            throw new Error(e)
        }
    }

    async queueLogs(log: BaseLog[]) {
        try {
            const currentQueue = await this.getQueuedLogs()
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

    async clearLogs() {
        try {
            return await loggingQueueCache.reset()
        } catch (e) {
            errorService.captureException(e)
        }
    }

    async postLog(log: BaseLog[]): Promise<Response | Error> {
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
            this.saveQueuedLogs(log)
            throw new Error(e)
        }
    }

    async log({ level, message, ...optionalFields }: LogParams) {
        try {
            const currentLog = await this.baseLog({
                level,
                message,
                ...optionalFields,
            })
            const logsToPost = await this.queueLogs([currentLog])

            const { isConnected } = await NetInfo.fetch()
            // Not connected, save the log queue
            if (!isConnected) {
                return this.saveQueuedLogs(logsToPost)
            }

            const postLogToService = await this.postLog(logsToPost)
            await this.clearLogs()
            return postLogToService
        } catch (e) {
            errorService.captureException(e)
            return e
        }
    }
}

const loggingService = new Logging()

export { Level, Feature, loggingService }
