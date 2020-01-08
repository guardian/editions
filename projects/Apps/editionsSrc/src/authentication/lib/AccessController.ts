import { Authorizer, AsyncCache } from './Authorizer'
import {
    AnyAttempt,
    NotRun,
    patchAttempt,
    isValid,
    isOnline,
    Connectivity,
    hasRun,
} from './Attempt'

type UpdateHandler<S> = (attempt: AnyAttempt<S>) => void

type AuthMap = {
    [key: string]: Authorizer<any, any, any, any>
}

type AuthName<I extends {}> = {
    [K in keyof I]: I[K] extends Authorizer<infer S, any, any, any> ? S : never
}[keyof I]

class AccessController<I extends AuthMap, S extends AuthName<I>> {
    private attempt: AnyAttempt<S> = NotRun
    private fetchingConnectivities: Set<Connectivity> = new Set()
    private subscribers: UpdateHandler<S>[] = []

    constructor(readonly authorizerMap: I) {
        this.authorizers.forEach(auth =>
            auth.subscribe(this.reconcileAttempts.bind(this)),
        )
    }

    public subscribe(fn: UpdateHandler<S>) {
        this.subscribers.push(fn)
        return () => {
            this.subscribers = this.subscribers.filter(sub => sub !== fn)
        }
    }

    public get authorizers(): Authorizer<
        S,
        unknown,
        unknown[],
        ReadonlyArray<AsyncCache<unknown>>
    >[] {
        return Object.values(this.authorizerMap)
    }

    private get hasAuthRun() {
        return hasRun(this.attempt)
    }

    private get isAuthOnline() {
        return hasRun(this.attempt) && isOnline(this.attempt)
    }

    public handleConnectionStatusChanged(isConnected: boolean) {
        if (!this.hasAuthRun) {
            if (isConnected) {
                return this.runCachedAuth('online')
            } else {
                return this.runCachedAuth('offline')
            }
        } else if (!this.isAuthOnline && isConnected) {
            return this.runCachedAuth('online')
        }
    }

    public getAttempt() {
        return this.attempt
    }

    /**
     * This will run the authentication caches for all the authorizers
     * the status will get updated as a results of each of these
     * if it comes back as valid then stop running them
     *
     * It will only call them for authorizers that haven't run
     */
    private async runCachedAuth(connectivity: Connectivity) {
        if (this.fetchingConnectivities.has(connectivity)) return
        try {
            this.fetchingConnectivities.add(connectivity)
            for (const authorizer of this.authorizers) {
                if (authorizer.isAuth(connectivity)) continue
                await authorizer.runAuthWithCachedCredentials(connectivity)
                if (isValid(this.attempt)) return
            }
        } finally {
            this.fetchingConnectivities.delete(connectivity)
        }
    }

    private async reconcileAttempts() {
        let attempt: AnyAttempt<S> = NotRun
        for (const authorizer of this.authorizers) {
            const candidate = authorizer.getAccessAttempt()
            attempt = patchAttempt(attempt, candidate) || attempt
            if (isValid(attempt)) {
                break
            }
        }
        this.updateAttempt(attempt)
    }

    private notifySubscribers() {
        this.subscribers.forEach(sub => sub(this.attempt))
    }

    private updateAttempt(attempt: AnyAttempt<S>) {
        if (this.attempt === attempt) return
        this.attempt = attempt
        this.notifySubscribers()
    }
}

export { AccessController }
