import { CASExpiry } from '../../../Apps/common/src/cas-expiry'
import { NetInfoStateType } from '@react-native-community/netinfo'
import { User } from '@sentry/react-native'

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

export interface MallardLogFormat {
    timestamp: Date
    level: Level
    message: string
    app: string
    version: string
    buildNumber: string
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
