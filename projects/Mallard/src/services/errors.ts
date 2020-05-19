import * as Sentry from '@sentry/react-native'
import Config from 'react-native-config'
import { isInBeta } from 'src/helpers/release-stream'
import ApolloClient from 'apollo-client'
import gql from 'graphql-tag'
import { GdprSwitchSetting } from 'src/helpers/settings'
import { loggingService } from './logging'
import { Level } from '../../../Apps/common/src/logging'

const { SENTRY_DSN_URL } = Config

type QueryData = { gdprAllowPerformance: GdprSwitchSetting }
const QUERY = gql('{ gdprAllowPerformance @client }')

export interface ErrorService {
    init(apolloClient: ApolloClient<object>): void
    captureException(err: Error): void
}

class ErrorServiceImpl implements ErrorService {
    // Can be `null` or boolean. This is kinda confusing and easy to
    // handle improperly, but not easy to change it's already in prod.
    private hasConsent: GdprSwitchSetting
    private hasConfigured: boolean
    private pendingQueue: Error[]

    constructor() {
        this.hasConsent = null
        this.hasConfigured = false
        this.pendingQueue = []
    }

    public init(apolloClient: ApolloClient<object>) {
        apolloClient.watchQuery<QueryData>({ query: QUERY }).subscribe({
            next: query => {
                if (query.loading) return
                this.handleConsentUpdate(query.data.gdprAllowPerformance)
            },
            error: error => {
                this.captureException(error)
            },
        })
    }

    private handleConsentUpdate(hasConsent: GdprSwitchSetting) {
        this.hasConsent = hasConsent
        if (hasConsent === false || hasConsent === null) return

        if (!this.hasConfigured) {
            Sentry.init({ dsn: SENTRY_DSN_URL })

            Sentry.setTag(
                'environment',
                __DEV__ ? 'DEV' : isInBeta() ? 'BETA' : 'RELEASE',
            )
            Sentry.setExtra('react', true)
            this.hasConfigured = true
        }

        while (this.pendingQueue.length > 0) {
            const err = this.pendingQueue.pop()
            // eslint-disable-next-line @typescript-eslint/no-non-null-assertion
            Sentry.captureException(err!)
        }
    }

    /**
     * If there is explicitly no consent, discard errors. If we don't know yet
     * (`null`), store in a queue that will get logged when we get consent.
     */
    public captureException(err: Error) {
        if (this.hasConsent === null) {
            this.pendingQueue.push(err)
        } else if (this.hasConsent === true) {
            Sentry.captureException(err)
        }
        // Also send to the logging service (where it manages its own consent and queue)
        loggingService.log({
            level: Level.ERROR,
            message: 'captureException',
            optionalFields: { error: err },
        })
    }
}

export const errorService: ErrorService = new ErrorServiceImpl()
