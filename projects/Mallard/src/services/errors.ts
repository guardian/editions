import Sentry from 'react-native-sentry'
import Config from 'react-native-config'
import { isInBeta } from 'src/helpers/release-stream'
import ApolloClient from 'apollo-client'
import gql from 'graphql-tag'

const { SENTRY_DSN_URL } = Config

type QueryData = { gdprAllowPerformance: boolean }
const QUERY = gql('{ gdprAllowPerformance @client }')

export interface ErrorService {
    init(apolloClient: ApolloClient<object>): void
    captureException(err: Error): void
}

class ErrorServiceImpl implements ErrorService {
    private hasConsent: boolean
    private hasConfigured: boolean
    private pendingQueue: Error[]

    constructor() {
        this.hasConsent = false
        this.hasConfigured = false
        this.pendingQueue = []
    }

    public init(apolloClient: ApolloClient<object>) {
        const obs = apolloClient.watchQuery<QueryData>({ query: QUERY })
        obs.subscribe({
            next: query => {
                if (query.loading) return
                this.handleConsentUpdate(query.data.gdprAllowPerformance)
            },
            error: error => {
                this.captureException(error)
            },
        })
    }

    private handleConsentUpdate(hasConsent: boolean) {
        this.hasConsent = hasConsent
        if (!hasConsent) return

        if (!this.hasConfigured) {
            Sentry.config(SENTRY_DSN_URL).install()
            Sentry.setTagsContext({
                environment: __DEV__ ? 'DEV' : isInBeta() ? 'BETA' : 'RELEASE',
                react: true,
            })
            this.hasConfigured = true
        }

        while (this.pendingQueue.length > 0) {
            const err = this.pendingQueue.pop()
            // eslint-disable-next-line @typescript-eslint/no-non-null-assertion
            Sentry.captureException(err!)
        }
    }

    public captureException(err: Error) {
        if (this.hasConsent) {
            Sentry.captureException(err)
        } else {
            this.pendingQueue.push(err)
        }
    }
}

export const errorService: ErrorService = new ErrorServiceImpl()
