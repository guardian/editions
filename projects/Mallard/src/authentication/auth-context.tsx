import React, { createContext, useState, useContext, useEffect } from 'react'
import {
    MembersDataAPIResponse,
    currentMembershipDataCache,
} from 'src/services/membership-service'
import { canViewEdition } from './helpers'
import { resetCredentials } from './storage'

type AuthInfo = MembersDataAPIResponse

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
            currentMembershipDataCache.get().then(data => {
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
        signedIn: (canViewEdition: boolean, data: MembersDataAPIResponse) => T
    }) => {
        switch (data) {
            case SENTINEL: {
                return pending()
            }
            case null: {
                return signedOut()
            }
            default: {
                return signedIn(canViewEdition(data), data)
            }
        }
    }
}

const AuthProvider = ({ children }: { children: React.ReactNode }) => {
    const [data, setData] = useState<AuthInfo | null>(null)
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
