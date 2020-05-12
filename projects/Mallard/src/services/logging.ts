// Logging Service that sends event logs to ELK
import NetInfo, { NetInfoStateType } from '@react-native-community/netinfo'
import { Platform } from 'react-native'
import DeviceInfo from 'react-native-device-info'
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
import {
    Level,
    Feature,
    MallardLogFormat,
    ReleaseChannel,
    OS,
} from '../../../Apps/common/src/logging'
import { GdprSwitchSetting } from 'src/helpers/settings'
import gql from 'graphql-tag'
import ApolloClient from 'apollo-client'

const { LOGGING_API_KEY } = Config
const ATTEMPTS_THEN_CLEAR = 10

interface LogParams {
    level: Level
    message: string
    optionalFields?: object
}

type QueryData = { gdprAllowPerformance: GdprSwitchSetting }
const QUERY = gql('{ gdprAllowPerformance @client }')

class Logging {
    hasConsent: GdprSwitchSetting
    numberOfAttempts: number

    constructor() {
        this.hasConsent = false
        this.numberOfAttempts = 0
    }

    init(apolloClient: ApolloClient<object>) {
        apolloClient.watchQuery<QueryData>({ query: QUERY }).subscribe({
            next: query => {
                if (query.loading) return
                this.hasConsent = query.data.gdprAllowPerformance
            },
            error: error => {
                errorService.captureException(error)
            },
        })
    }

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
    }: LogParams): Promise<MallardLogFormat> {
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
            os: Platform.OS === 'ios' ? OS.IOS : OS.ANDROID,
            device: DeviceInfo.getDeviceId(),
            networkStatus: networkStatus
                ? networkStatus.type
                : NetInfoStateType.unknown,
            release_channel: isInBeta()
                ? ReleaseChannel.BETA
                : ReleaseChannel.RELEASE,
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

    async getQueuedLogs(): Promise<string> {
        try {
            return (await loggingQueueCache.get()) || '[{}]'
        } catch (e) {
            return '[{}]'
        }
    }

    async saveQueuedLogs(log: MallardLogFormat[]): Promise<string | Error> {
        try {
            const logString = JSON.stringify(log)
            await loggingQueueCache.set(logString)
            return 'saved logs'
        } catch (e) {
            errorService.captureException(e)
            throw new Error(e)
        }
    }

    async queueLogs(log: MallardLogFormat[]) {
        try {
            const currentQueueString = await this.getQueuedLogs()
            const parsedQueue = JSON.parse(currentQueueString)
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
            // Assumes there is a problem sending logs and clears them
            const { isConnected } = await NetInfo.fetch()
            if (isConnected) {
                return await loggingQueueCache.reset()
            }
        } catch (e) {
            errorService.captureException(e)
        }
    }

    async postLog(log: MallardLogFormat[]): Promise<Response | Error> {
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
            this.numberOfAttempts = 0
            return response
        } catch (e) {
            if (this.numberOfAttempts >= ATTEMPTS_THEN_CLEAR) {
                await this.clearLogs()
                this.numberOfAttempts = 0
            } else {
                await this.saveQueuedLogs(log)
                this.numberOfAttempts++
            }
            throw new Error(e)
        }
    }

    // Designed to post logs that have been queued but havent sent
    async postQueuedLogs(): Promise<void> {
        try {
            const queuedLogsString = await this.getQueuedLogs()
            const queuedLogs = JSON.parse(queuedLogsString)
            await this.postLog(queuedLogs)
        } catch {
            await this.clearLogs()
        }
    }

    async log({ level, message, ...optionalFields }: LogParams) {
        try {
            if (!this.hasConsent) {
                return
            }

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
