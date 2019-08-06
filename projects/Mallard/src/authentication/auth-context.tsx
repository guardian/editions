import React, { createContext, useState, useContext, useEffect } from 'react'
import { resetCredentials } from './storage'
import { useNetInfo } from '@react-native-community/netinfo'
import {
    liveAuthChain,
    cachedAuthChain,
    AuthStatus,
    pending,
    isAuthed,
    unauthed,
    isPending,
} from './credentials-chain'
import { UserData, canViewEdition } from './helpers'

interface AuthAttempt {
    time: number
    type: 'live' | 'cached'
    status: AuthStatus
}

const createAttempt = (
    status: AuthStatus,
    type: 'live' | 'cached',
): AuthAttempt => ({
    time: Date.now(),
    type,
    status,
})

const AuthContext = createContext<{
    status: AuthStatus
    setStatus: (status: AuthStatus) => void
    signOut: () => Promise<void>
}>({
    status: pending,
    setStatus: () => {},
    signOut: () => Promise.resolve(),
})

const AUTH_EXPIRY = 86400000 // ms in a day

const needsReauth = (attempt: AuthAttempt, isInternetReachable: boolean) =>
    (attempt.type === 'cached' && isInternetReachable) ||
    (isPending(attempt.status) ||
        (isAuthed(attempt.status) && attempt.time < Date.now() - AUTH_EXPIRY))

const assertUnreachable = (x: never): never => {
    throw new Error('This should be unreachable')
}

const useAuth = () => {
    const { status } = useContext(AuthContext)

    return <T extends unknown>({
        pending,
        authed,
        unauthed,
    }: {
        pending: () => T
        unauthed: (signedIn: boolean) => T
        authed: () => T
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
                        return canViewEdition(status.data.info.membershipData)
                            ? authed()
                            : unauthed(true)
                    }
                    default: {
                        return authed()
                    }
                }
            }
            default: {
                return assertUnreachable(status)
            }
        }
    }
}

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

const AuthProvider = ({ children }: { children: React.ReactNode }) => {
    const [authAttempt, setAuthAttempt] = useState<AuthAttempt>({
        time: 0,
        type: 'cached',
        status: pending,
    })
    const { isInternetReachable } = useNetInfo()

    useEffect(() => {
        if (!needsReauth(authAttempt, !!isInternetReachable)) return

        if (isInternetReachable) {
            liveAuthChain().then(status =>
                setAuthAttempt(createAttempt(status, 'live')),
            )
        } else {
            // this sets the time to be immediately requiring a reauth as soon
            // as we get network, but the user is authed until then if they were
            // authed previously
            cachedAuthChain().then(status =>
                setAuthAttempt(createAttempt(status, 'cached')),
            )
        }
    }, [isInternetReachable, authAttempt])

    return (
        <AuthContext.Provider
            value={{
                status: authAttempt.status,
                setStatus: (status: AuthStatus) =>
                    setAuthAttempt(createAttempt(status, 'live')),
                signOut: async () => {
                    await resetCredentials()
                    setAuthAttempt(createAttempt(unauthed, 'live'))
                },
            }}
        >
            {children}
        </AuthContext.Provider>
    )
}

export { AuthProvider, AuthContext, useAuth, useIdentity }
