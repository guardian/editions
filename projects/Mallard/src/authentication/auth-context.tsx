import React, {
    createContext,
    useState,
    useContext,
    useEffect,
    useMemo,
    useCallback,
} from 'react'
import { signOutIdentity } from '../helpers/storage'
import { useNetInfo } from '@react-native-community/netinfo'
import {
    liveAuthChain,
    cachedAuthChain,
    AuthStatus,
    pending,
    isAuthed,
    unauthed,
    isPending,
    AuthType,
    isIdentity,
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
}>({
    status: pending,
    setStatus: () => {},
    signOutIdentity: () => Promise.resolve(),
    restorePurchases: () => Promise.resolve(),
    isRestoring: false,
    isAuthing: false,
})

const needsReauth = (
    prevAttempt: AuthAttempt,
    { isConnected }: { isConnected: boolean | null },
) =>
    (prevAttempt.type === 'cached' && isConnected) ||
    (isPending(prevAttempt.status) ||
        (isAuthed(prevAttempt.status) &&
            prevAttempt.time < Date.now() - AUTH_TTL))

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
    const { status } = useContext(AuthContext)
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

const AuthProvider = ({
    children,
    onStatusChange,
}: {
    children: React.ReactNode
    onStatusChange: (status: AuthStatus) => void
}) => {
    const [isAuthing, setIsAuthing] = useState(false)
    const [isRestoring, setIsRestoring] = useState(false)
    const [authAttempt, setAuthAttempt] = useState<AuthAttempt>({
        time: 0,
        type: 'cached',
        status: pending,
    })
    const { isConnected } = useNetInfo()
    const { open } = useModal()

    const updateAuth = (attempt: AuthAttempt) => {
        setAuthAttempt(attempt)
        onStatusChange(attempt.status)
    }

    const runAuth = useCallback(async () => {
        setIsAuthing(true)
        if (isConnected) {
            const status = await liveAuthChain()
            const attempt = createAuthAttempt(status, 'live')
            updateAuth(attempt)
            setIsAuthing(false)
            return attempt
        } else {
            // all cached attempts are retried when we get internet connection
            // back
            const status = await cachedAuthChain()
            const attempt = createAuthAttempt(status, 'cached')
            updateAuth(attempt)
            setIsAuthing(false)
            return attempt
        }
    }, [isConnected])

    useEffect(() => {
        if (isAuthing || !needsReauth(authAttempt, { isConnected })) return
        runAuth()
    }, [isConnected, authAttempt, isAuthing, runAuth]) // we don't care about isAuthing changing

    const value = useMemo(
        () => ({
            status: authAttempt.status,
            setStatus: (status: AuthStatus) =>
                updateAuth(createAuthAttempt(status, 'live')),
            signOutIdentity: async () => {
                await signOutIdentity()
                // if a user is authenticated through identity then unauth them
                // and try to run authentication again
                // otherwise, their identity sign in didn't affect their auth status
                // so leave their auth status as is
                if (isIdentity(authAttempt.status)) {
                    updateAuth(createAuthAttempt(unauthed, 'live'))
                    await runAuth()
                }
            },
            isRestoring,
            isAuthing,
            restorePurchases: async function restorePurchases() {
                // await the receipt being added to the system by iOS
                // this will prompt a user to login to their iTunes account

                if (isRestoring) return
                setIsRestoring(true)

                try {
                    const authStatus = await tryToRestoreActiveIOSSubscriptionToAuth()
                    if (authStatus && authAttempt.status.type !== 'authed') {
                        updateAuth(
                            createAuthAttempt(
                                { type: 'authed', data: authStatus },
                                'live',
                            ),
                        )
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
            },
        }),
        [authAttempt.status, isAuthing, isRestoring, open, runAuth],
    )

    return <AuthContext.Provider value={value}>{children}</AuthContext.Provider>
}

export {
    AuthProvider,
    AuthContext,
    useAuth,
    useIdentity,
    needsReauth,
    createAuthAttempt,
}
