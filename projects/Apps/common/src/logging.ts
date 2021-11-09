import { CASExpiry } from '../../../Apps/common/src/cas-expiry'
import { NetInfoStateType } from '@react-native-community/netinfo'
import { User } from '@sentry/react-native'
import { EditionId } from '../../../Apps/common/src/index'

export enum Level {
    INFO = 'INFO',
    WARN = 'WARN',
    ERROR = 'ERROR',
    DEBUG = 'DEBUG',
}

export enum Feature {
    DOWNLOAD = 'DOWNLOAD',
    PUSH_NOTIFICATION = 'PUSH_NOTIFICATION',
    BACKGROUNG_DOWNLOAD = 'BACKGROUND_DOWNLOAD',
    CLEAR_ISSUES = 'CLEAR_ISSUES',
    SIGN_IN = 'SIGN_IN',
}

export enum ReleaseChannel {
    BETA = 'BETA',
    RELEASE = 'RELEASE',
}

export enum OS {
    IOS = 'ios',
    ANDROID = 'android',
}

export interface MallardLogFormat {
    timestamp?: Date
    level: Level
    message: string
    app: string
    version: string
    buildNumber: string
    release_channel: ReleaseChannel
    selectedEdition: EditionId
    defaultEdition: EditionId | null
    os: OS
    device: string
    networkStatus: NetInfoStateType
    deviceId: string
    signedIn: boolean
    userId: User['id'] | null
    digitalSub: boolean
    casCode: CASExpiry['subscriptionCode'] | null
    iAP: boolean
    feature?: Feature
    isConnected: boolean
    isPoorConnection: boolean
}
