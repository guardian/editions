import {
    onSettingChanged,
    getSetting,
    GdprSwitchSettings,
} from 'src/helpers/settings'
import * as Sentry from '@sentry/react-native'
import Config from 'react-native-config'
import { isInBeta } from 'src/helpers/release-stream'

const { SENTRY_DSN_URL } = Config

const DEFAULT_SETTING_KEY = 'gdprAllowPerformance' as const

interface SentryImpl {
    init(options: { dsn: string }): void
    captureException: (err: Error) => void
    setTag: (name: string, value: any) => void
}

enum InitState {
    unitialized,
    initializing,
    initialized,
}

class ErrorService {
    private settingKey: keyof GdprSwitchSettings
    private hasConsent: boolean
    private hasConfigured: boolean
    private initState: InitState
    private initQueue: Error[]
    private getSettingImpl: typeof getSetting
    private onSettingChangedImpl: typeof onSettingChanged
    private sentryImpl: SentryImpl
    private deregisterSettingListener: () => void

    constructor(
        settingKey: keyof GdprSwitchSettings = DEFAULT_SETTING_KEY,
        getSettingImpl = getSetting,
        onSettingChangedImpl = onSettingChanged,
        sentryImpl: SentryImpl = Sentry,
    ) {
        this.settingKey = settingKey
        this.hasConsent = false
        this.initState = InitState.unitialized
        this.hasConfigured = false
        this.initQueue = []
        this.getSettingImpl = getSettingImpl
        this.onSettingChangedImpl = onSettingChangedImpl
        this.sentryImpl = sentryImpl
        this.deregisterSettingListener = () => {}
    }

    public async init() {
        this.initState = InitState.initializing
        this.addSettingListener()
        this.handleConsentUpdate(!!(await this.getSettingImpl(this.settingKey)))
        this.initState = InitState.initialized
        this.processInitQueue()
        return this
    }

    private handleConsentUpdate(hasConsent: boolean) {
        this.hasConsent = hasConsent
        if (this.hasConsent && !this.hasConfigured) {
            this.sentryImpl.init({ dsn: SENTRY_DSN_URL })
            this.sentryImpl.setTag(
                'environment',
                __DEV__ ? 'DEV' : isInBeta() ? 'BETA' : 'RELEASE',
            )
            this.sentryImpl.setTag('react', true)
            this.hasConfigured = true
        }
    }

    private addSettingListener() {
        this.deregisterSettingListener = this.onSettingChangedImpl(
            (key, value) => {
                if (key === this.settingKey) {
                    this.handleConsentUpdate(!!value)
                }
            },
        )
    }

    private processInitQueue() {
        if (this.hasConsent) {
            // if we do have consent send all the errors to sentry
            while (this.initQueue.length) {
                const err = this.initQueue.pop()
                // eslint-disable-next-line @typescript-eslint/no-non-null-assertion
                this.sentryImpl.captureException(err!)
            }
        } else {
            // if we don't have consent then ignore all errors
            this.initQueue = []
        }
    }

    public captureException(err: Error) {
        switch (this.initState) {
            case InitState.initialized: {
                if (this.hasConsent) {
                    this.sentryImpl.captureException(err)
                }
                break
            }
            case InitState.initializing: {
                this.initQueue.push(err)
                break
            }
            default: {
                break
            }
        }
    }

    public destroy() {
        this.deregisterSettingListener()
    }
}

const singletonErrorService = new ErrorService()

export { singletonErrorService as errorService, ErrorService }
