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

/**
 * An Access controller is responsible for listening to its Authorizers
 * each time a sign in happens it will try to upgrade the current access level.
 * If it can't "upgrade" the access level it will keep it as it was.
 *
 * An Access controller only requires one authorizer to have a valid `accessAttempt`
 * in order to report as being valid itself.
 *
 * An upgrade is defined as either moving from offline to online (online attempts
 * are more important than offline) or moving from invalid to valid. Currently
 * the model doesn't support unauthenticated a user with a second attempt at authentication.
 *
 * This also handle sign outs too by simply reconciling all of the authorizer attempts
 * into this "most online" and then "most valid" after an authorizer has signed out.
 *
 * This will also run the "silent" authorizer methods from caches when some form of
 * connectivity is passed to `handleConnectionStatusChanged`. Although this will only
 * ever cause at most two "silent" auths. An online one and, if it comes before the online one,
 * an offline one.
 */
class AccessController<I extends {}> {
    private attempt: AnyAttempt<string> = NotRun
    private fetchingConnectivities: Set<Connectivity> = new Set()
    private subscribers: UpdateHandler[] = []

    constructor(readonly authorizerMap: AuthMap<I>) {
        this.authorizers.forEach(auth =>
            auth.subscribe(this.reconcileAttempts.bind(this)),
        )
    }

    public subscribe(fn: UpdateHandler) {
        this.subscribers.push(fn)
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
