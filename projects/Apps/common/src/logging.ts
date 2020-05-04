export enum Level {
    INFO = 'INFO',
    WARN = 'WARN',
    ERROR = 'ERROR',
    DEBUG = 'DEBUG',
}

export interface LogFormat {
    '@timestamp': number
    level: Level
    message: string
    metadata?: LogMetaData
}

interface LogMetaData {
    app: string
    version: string
    buildNumber: string
    message: object
    release_channel: 'BETA' | 'RELEASE'
    os: 'android' | 'ios'
    device: string
    network_status: string
    // feature: Feature
    // May need to consent for the below
    deviceId: string
    signedIn: boolean
    userId: string | null
    digitalSub: boolean
    casCode: string | null
    iAP: boolean
}
