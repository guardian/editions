import React, { createContext, useState, useContext, useEffect } from 'react'
import { canViewEdition, userDataCache, UserData } from './helpers'
import { resetCredentials } from './storage'

type AuthInfo = UserData

const SENTINEL: unique symbol = Symbol('auth-not-loaded')

const AuthContext = createContext<{
    data: AuthInfo | typeof SENTINEL | null
    setData: (data: AuthInfo | null) => void
    signOut: () => Promise<void>
}>({
    data: SENTINEL,
    setData: () => {},
    signOut: () => Promise.resolve(),
})

const useAuth = () => {
    const { data, setData } = useContext(AuthContext)

    useEffect(() => {
        if (data === SENTINEL) {
            userDataCache.get().then(data => {
                setData(data)
            })
        }
    }, [data, setData])

    return <T extends unknown>({
        pending,
        signedIn,
        signedOut,
    }: {
        pending: () => T
        signedOut: () => T
        signedIn: (canViewEdition: boolean, data: AuthInfo) => T
    }) => {
        switch (data) {
            case SENTINEL: {
                return pending()
            }
            case null: {
                return signedOut()
            }
            default: {
                return signedIn(canViewEdition(data.membershipData), data)
            }
        }
    }
}

const AuthProvider = ({ children }: { children: React.ReactNode }) => {
    const [data, setData] = useState<AuthInfo | typeof SENTINEL | null>(
        SENTINEL,
    )
    return (
        <AuthContext.Provider
            value={{
                data,
                setData,
                signOut: async () => {
                    await resetCredentials()
                    setData(null)
                },
            }}
        >
            {children}
        </AuthContext.Provider>
    )
}

export { AuthProvider, AuthContext, useAuth }
