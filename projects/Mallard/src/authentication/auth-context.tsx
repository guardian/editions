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
    time = Date.now(),
): AuthAttempt => ({
    time,
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

const AUTH_TTL = 86400000 // ms in a day

const needsReauth = (prevAttempt: AuthAttempt, isInternetReachable: boolean) =>
    (prevAttempt.type === 'cached' && isInternetReachable) ||
    (isPending(prevAttempt.status) ||
        (isAuthed(prevAttempt.status) &&
            prevAttempt.time < Date.now() - AUTH_TTL))

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
    const [isFetching, setIsFetching] = useState(false)
    const [authAttempt, setAuthAttempt] = useState<AuthAttempt>({
        time: 0,
        type: 'cached',
        status: pending,
    })
    const { isInternetReachable } = useNetInfo()

    useEffect(() => {
        if (isFetching || !needsReauth(authAttempt, !!isInternetReachable))
            return

        setIsFetching(true)
        if (isInternetReachable) {
            liveAuthChain().then(status => {
                setAuthAttempt(createAttempt(status, 'live'))
                setIsFetching(false)
            })
        } else {
            // all cached attempts are retried when we get internet connection
            // back
            cachedAuthChain().then(status => {
                setAuthAttempt(createAttempt(status, 'cached'))
                setIsFetching(false)
            })
        }
    }, [isInternetReachable, authAttempt, isFetching])

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

export {
    AuthProvider,
    AuthContext,
    useAuth,
    useIdentity,
    needsReauth,
    createAttempt,
}
