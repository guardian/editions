import React, {
    createContext,
    useState,
    useContext,
    useEffect,
    useMemo,
    useCallback,
} from 'react'
import { signOutIdentity } from '../helpers/storage'
import { useNetInfo } from 'src/hooks/use-net-info'
import {
    nonIdentityAuthChain,
    cachedNonIdentityAuthChain,
    AuthStatus,
    pending,
    isAuthed,
    unauthed,
    isPending,
    AuthType,
    isIdentity,
    identityAuthChain,
    cachedIdentityAuthChain,
    IdentityAuth,
    IdentityAuthStatus,
} from './credentials-chain'
import { UserData, canViewEdition } from './helpers'
import { AUTH_TTL } from 'src/constants'
import { tryToRestoreActiveIOSSubscriptionToAuth } from 'src/services/iap'
import { useModal } from 'src/components/modal'
import { MissingIAPModalCard } from 'src/components/missing-iap-modal-card'

interface AuthAttempt {
    time: number
    type: 'live' | 'cached'
    status: AuthStatus
}

const createAuthAttempt = (
    status: AuthStatus,
    type: 'live' | 'cached',
    time = Date.now(),
): AuthAttempt => ({
    time,
    type,
    status,
})

const AuthContext = createContext<{
    status: AuthStatus
    setStatus: (status: AuthStatus) => void
    signOutIdentity: () => Promise<void>
    restorePurchases: () => Promise<void>
    isRestoring: boolean
    isAuthing: boolean
    identityStatus: AuthStatus<IdentityAuth>
}>({
    status: pending,
    setStatus: () => {},
    signOutIdentity: () => Promise.resolve(),
    restorePurchases: () => Promise.resolve(),
    isRestoring: false,
    isAuthing: false,
    identityStatus: pending,
})

const needsReauth = (
    prevAttempt: AuthAttempt,
    { isConnected }: { isConnected: boolean | null },
) => prevAttempt.type === 'cached' && isConnected

const assertUnreachable = (x: never): never => {
    throw new Error('This should be unreachable')
}

/**
 * This will check whether a user is authenticated via any of the varied means:
 * CAS, Identity etc.
 */
const useAuth = () => {
    const { status } = useContext(AuthContext)

    return <T extends unknown>({
        pending,
        authed,
        unauthed,
    }: {
        pending: () => T
        unauthed: (signedIn: boolean) => T
        authed: (type: AuthType) => T
    }) => {
        switch (status.type) {
            case 'pending': {
                return pending()
            }
            case 'unauthed': {
                return unauthed(false)
            }
            case 'authed': {
                switch (status.data.type) {
                    case 'identity': {
                        return canViewEdition(status.data.info)
                            ? authed(status.data)
                            : unauthed(true)
                    }
                    default: {
                        return authed(status.data)
                    }
                }
            }
            default: {
                return assertUnreachable(status)
            }
        }
    }
}

/**
 * Use useIdentity to see whether a user is logged in
 *
 * This does _not_ mean they are authenticated, just that they are signed in
 * with a Guardian account. We may want to keep people logged in who's identity account
 * doesn't allow them access to editions as they may be authed to view editions by another
 * route (CAS, IAP, etc.)
 */
const useIdentity = () => {
    const { identityStatus: status } = useContext(AuthContext)
    return <T extends unknown>({
        pending,
        signedIn,
        signedOut,
    }: {
        pending: () => T
        signedOut: () => T
        signedIn: (data: UserData) => T
    }) => {
        switch (status.type) {
            case 'pending': {
                return pending()
            }
            case 'unauthed': {
                return signedOut()
            }
            case 'authed': {
                switch (status.data.type) {
                    case 'identity': {
                        return signedIn(status.data.info)
                    }
                    default: {
                        return signedOut()
                    }
                }
            }
            default: {
                return assertUnreachable(status)
            }
        }
    }
}

const createRunAuth = (
    isAuthing: boolean,
    setIsAuthing: (isRunning: boolean) => void,
    setIdentityStatus: (status: AuthStatus<IdentityAuth>) => void,
    updateAuth: (status: AuthStatus, type: 'live' | 'cached') => void,
) => async (
    type: 'live' | 'cached',
    runIdentityChain: () => Promise<AuthStatus<IdentityAuth>>,
    runNonIdentityChain: () => Promise<AuthStatus>,
) => {
    if (isAuthing) return
    setIsAuthing(true)

    try {
        const idStatus = await runIdentityChain()
        if (isAuthed(idStatus)) {
            setIdentityStatus(IdentityAuthStatus(idStatus.data.info))
            if (canViewEdition(idStatus.data.info)) {
                updateAuth(idStatus, type)
                return
            }
        } else {
            setIdentityStatus(unauthed)
        }
        const status = await runNonIdentityChain()
        updateAuth(status, type)
    } catch {
        // TODO: should we do anything special here
    } finally {
        setIsAuthing(false)
    }
}

const AuthProvider = ({
    children,
    onIdentityStatusChange,
}: {
    children: React.ReactNode
    onIdentityStatusChange: (status: IdentityAuth | null) => void
}) => {
    const [isAuthing, setIsAuthing] = useState(false)
    const [isRestoring, setIsRestoring] = useState(false)
    const [identityStatus, setIdentityStatus] = useState<
        AuthStatus<IdentityAuth>
    >(pending)
    const [authAttempt, setAuthAttempt] = useState<AuthAttempt>({
        time: 0,
        type: 'cached',
        status: pending,
    })
    const { isConnected } = useNetInfo()
    const { open } = useModal()

    const updateAuth = useCallback(
        (status: AuthStatus, type: 'live' | 'cached') => {
            if (isIdentity(status)) {
                onIdentityStatusChange(status.data)
                setIdentityStatus(status)
                if (canViewEdition(status.data.info)) {
                    setAuthAttempt(createAuthAttempt(status, type))
                } else {
                    setAuthAttempt(createAuthAttempt(unauthed, type))
                }
            } else if (isAuthed(authAttempt.status)) {
                // do nothing
            } else {
                setAuthAttempt(createAuthAttempt(status, type))
            }
        },
        [onIdentityStatusChange, authAttempt],
    )

    const runAuth = useCallback(async () => {
        const runAuth = createRunAuth(
            isAuthing,
            setIsAuthing,
            setIdentityStatus,
            updateAuth,
        )

        if (isConnected) {
            runAuth('live', identityAuthChain, nonIdentityAuthChain)
        } else {
            // all cached attempts are retried when we get internet connection
            // back
            runAuth('cached', cachedIdentityAuthChain, () =>
                cachedNonIdentityAuthChain(),
            )
        }
    }, [isConnected, isAuthing, updateAuth])

    useEffect(() => {
        if (!isAuthing && needsReauth(authAttempt, { isConnected })) runAuth()
    }, [isAuthing, isConnected, authAttempt, runAuth]) // we don't care about isAuthing changing

    const setStatus = useCallback(
        (status: AuthStatus) => {
            updateAuth(status, 'live')
        },
        [updateAuth],
    )

    const signOutIdentityImpl = useCallback(async () => {
        await signOutIdentity()
        // if a user is authenticated through identity then unauth them
        // and try to run authentication again
        // otherwise, their identity sign in didn't affect their auth status
        // so leave their auth status as is
        setIdentityStatus(unauthed)
        onIdentityStatusChange(null)

        if (isIdentity(authAttempt.status)) {
            setAuthAttempt(createAuthAttempt(unauthed, 'live'))
            runAuth()
        }
    }, [authAttempt.status, runAuth, onIdentityStatusChange])

    const restorePurchases = useCallback(async () => {
        // await the receipt being added to the system by iOS
        // this will prompt a user to login to their iTunes account

        if (isRestoring) return
        setIsRestoring(true)

        try {
            const authStatus = await tryToRestoreActiveIOSSubscriptionToAuth()

            // only update the auth type if we're not already authenticated
            if (authStatus && authAttempt.status.type !== 'authed') {
                updateAuth({ type: 'authed', data: authStatus }, 'live')
            } else {
                open(close => (
                    <MissingIAPModalCard
                        close={close}
                        onTryAgain={restorePurchases}
                    />
                ))
            }
        } catch (e) {
            open(close => (
                <MissingIAPModalCard
                    close={close}
                    onTryAgain={restorePurchases}
                />
            ))
        } finally {
            setIsRestoring(false)
        }
    }, [authAttempt.status.type, isRestoring, open, updateAuth])

    const value = useMemo(
        () => ({
            identityStatus,
            status: authAttempt.status,
            setStatus,
            signOutIdentity: signOutIdentityImpl,
            isRestoring,
            isAuthing,
            restorePurchases,
        }),
        [
            authAttempt.status,
            identityStatus,
            isAuthing,
            isRestoring,
            signOutIdentityImpl,
            restorePurchases,
            setStatus,
        ],
    )

    return <AuthContext.Provider value={value}>{children}</AuthContext.Provider>
}

export {
    createRunAuth,
    AuthProvider,
    AuthContext,
    useAuth,
    useIdentity,
    needsReauth,
    createAuthAttempt,
}
