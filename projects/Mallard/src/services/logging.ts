// Logging Service that sends event logs to ELK
import NetInfo, { NetInfoStateType } from '@react-native-community/netinfo'
import ApolloClient from 'apollo-client'
import gql from 'graphql-tag'
import { Platform } from 'react-native'
import Config from 'react-native-config'
import DeviceInfo from 'react-native-device-info'
import { getCASCode } from 'src/authentication/helpers'
import { isInBeta } from 'src/helpers/release-stream'
import { GdprSwitchSetting } from 'src/helpers/settings'
import { defaultSettings } from 'src/helpers/settings/defaults'
import {
    iapReceiptCache,
    loggingQueueCache,
    userDataCache,
} from 'src/helpers/storage'
import {
    Feature,
    Level,
    MallardLogFormat,
    ReleaseChannel,
    OS,
} from '../../../Apps/common/src/logging'
import { AsyncQueue } from '../helpers/async-queue-cache'
import { errorService } from './errors'

const { LOGGING_API_KEY } = Config
const ATTEMPTS_THEN_CLEAR = 10

interface LogParams {
    level: Level
    message: string
    optionalFields?: object
}

type QueryData = { gdprAllowPerformance: GdprSwitchSetting }
const QUERY = gql('{ gdprAllowPerformance @client }')

class Logging extends AsyncQueue {
    hasConsent: GdprSwitchSetting
    numberOfAttempts: number

    constructor() {
        super(loggingQueueCache)
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

    async postLogToService(log: object[]): Promise<Response | Error> {
        const response = await fetch(defaultSettings.logging, {
            method: 'POST',
            headers: {
                Accept: 'application/json',
                'Content-Type': 'application/json',
                'x-api-key': LOGGING_API_KEY,
            },
            body: JSON.stringify(log),
        })
        if (response.status !== 200) {
            throw new Error(
                `Bad response from Logging Service - status: ${response.status}`,
            )
        }
        return response
    }

    async postLog(log: object[]) {
        try {
            await this.postLogToService(log)
            this.numberOfAttempts = 0
        } catch (e) {
            if (this.numberOfAttempts >= ATTEMPTS_THEN_CLEAR) {
                await this.clearItems()
                this.numberOfAttempts = 0
            } else {
                await this.saveQueuedItems(log)
                this.numberOfAttempts++
            }
            throw new Error(e)
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
            const logsToPost = await this.queueItems([currentLog])

            const { isConnected } = await NetInfo.fetch()
            // Not connected, save the log queue
            if (!isConnected) {
                return this.saveQueuedItems(logsToPost)
            }

            const postLogToService = await this.postLog(logsToPost)
            await this.clearItems()
            return postLogToService
        } catch (e) {
            errorService.captureException(e)
            return e
        }
    }
}

const loggingService = new Logging()

export { Level, Feature, Logging, loggingService }
