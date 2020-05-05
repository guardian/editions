import { CASExpiry } from '../../../Apps/common/src/cas-expiry'
import { NetInfoStateType } from '@react-native-community/netinfo'
import { User } from '@sentry/react-native'

export enum Level {
    INFO = 'INFO',
    WARN = 'WARN',
    ERROR = 'ERROR',
    DEBUG = 'DEBUG',
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
