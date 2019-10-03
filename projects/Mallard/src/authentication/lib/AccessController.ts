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

type UpdateHandler = (attempt: AnyAttempt<string>) => void

type AuthMap<I extends {}> = {
    [K in keyof I]: I[K] extends Authorizer<any, any, any> ? I[K] : never
}

class AccessController<I extends {}> {
    private attempt: AnyAttempt<string> = NotRun
    private subscribers: UpdateHandler[] = []

    constructor(readonly authorizerMap: AuthMap<I>) {
        this.authorizers.forEach(auth =>
            auth.subscribe(this.reconcileAttempts.bind(this)),
        )
    }

    public subscribe(fn: UpdateHandler) {
        this.subscribers.push(fn)
        fn(this.attempt)
        return () => {
            this.subscribers = this.subscribers.filter(sub => sub !== fn)
        }
    }

    public get authorizers(): Authorizer<
        unknown,
        unknown[],
        ReadonlyArray<AsyncCache<unknown>>
    >[] {
        return Object.values(this.authorizerMap)
    }

    public get hasAuthRun() {
        return hasRun(this.attempt)
    }

    public get isAuthOnline() {
        return hasRun(this.attempt) && isOnline(this.attempt)
    }

    public get isAuthValid() {
        return isValid(this.attempt)
    }

    // TODO: put this logic elsewhere
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
        for (const authorizer of this.authorizers) {
            if (authorizer.isAuth(connectivity)) continue
            await authorizer.runAuthWithCachedCredentials(connectivity)
            if (isValid(this.attempt)) return
        }
    }

    private async reconcileAttempts() {
        let attempt: AnyAttempt<string> = NotRun
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

    private updateAttempt(attempt: AnyAttempt<string>) {
        if (this.attempt === attempt) return
        this.attempt = attempt
        this.notifySubscribers()
    }
}

export { AccessController }
