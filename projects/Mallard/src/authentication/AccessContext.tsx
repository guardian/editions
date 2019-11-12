import React, {
    createContext,
    useState,
    useContext,
    useEffect,
    useMemo,
} from 'react'
import { AccessController } from './lib/AccessController'
import {
    AnyAttempt,
    isValid,
    ResolvedAttempt,
    InvalidAttempt,
    NotRun,
} from './lib/Attempt'
import identity, {
    IdentityAuthData,
    AuthParams,
} from './authorizers/IdentityAuthorizer'
import cas from './authorizers/CASAuthorizer'
import iap from './authorizers/IAPAuthorizer'
import { CASExpiry } from './services/cas'
import { ReceiptIOS } from './services/iap'
import * as NetInfo from '@react-native-community/netinfo'

type AttemptType = 'iap' | 'cas' | 'identity'

type AttemptResponse<T> = {
    attempt: ResolvedAttempt<T>
    accessAttempt: ResolvedAttempt<AttemptType>
}

const defaultAttemptResponse = Promise.resolve({
    attempt: InvalidAttempt('offline'),
    accessAttempt: InvalidAttempt('offline'),
})

const AccessContext = createContext({
    attempt: NotRun as AnyAttempt<AttemptType>,
    canAccess: false,
    authIdentity: (
        // eslint-disable-next-line @typescript-eslint/no-unused-vars
        params: AuthParams,
    ): Promise<AttemptResponse<IdentityAuthData>> => defaultAttemptResponse,
    authCAS: (
        // eslint-disable-next-line @typescript-eslint/no-unused-vars
        subscriberId: string,
        // eslint-disable-next-line @typescript-eslint/no-unused-vars
        password: string,
    ): Promise<AttemptResponse<CASExpiry>> =>
        Promise.resolve(defaultAttemptResponse),
    authIAP: (): Promise<AttemptResponse<ReceiptIOS>> =>
        Promise.resolve(defaultAttemptResponse),
    identityData: null as IdentityAuthData | null,
    casData: null as CASExpiry | null,
    iapData: null as ReceiptIOS | null,
    signOutIdentity: () => {},
    signOutCAS: () => {},
})

const controller = new AccessController({
    identity,
    cas,
    iap,
})

const authCAS = cas.runAuth.bind(cas)
const authIAP = iap.runAuth.bind(iap)
const signOutCAS = cas.signOut.bind(cas)
const authIdentity = identity.runAuth.bind(identity)
const signOutIdentity = identity.signOut.bind(identity)

const AccessProvider = ({
    children,
    onIdentityStatusChange = () => {},
}: {
    children: React.ReactNode
    onIdentityStatusChange?: (idAttempt: AnyAttempt<IdentityAuthData>) => void
}) => {
    const [attempt, setAttempt] = useState<AnyAttempt<AttemptType>>(
        controller.getAttempt(),
    )
    const [idAuth, setIdAuth] = useState<AnyAttempt<IdentityAuthData>>(
        controller.authorizerMap.identity.getAttempt(),
    )
    const [casAuth, setCASAuth] = useState<AnyAttempt<CASExpiry>>(
        controller.authorizerMap.cas.getAttempt(),
    )
    const [iapAuth, setIAPAuth] = useState<AnyAttempt<ReceiptIOS>>(
        controller.authorizerMap.iap.getAttempt(),
    )

    useEffect(() => {
        const unsubController = controller.subscribe(setAttempt)
        const unsubIdentity = controller.authorizerMap.identity.subscribe(
            attempt => {
                setIdAuth(attempt)
                onIdentityStatusChange(attempt)
            },
        )
        const unsubCAS = controller.authorizerMap.cas.subscribe(setCASAuth)
        const unsubIAP = controller.authorizerMap.iap.subscribe(setIAPAuth)
        NetInfo.addEventListener(info =>
            controller.handleConnectionStatusChanged(info.isConnected),
        )
        return () => {
            unsubController()
            unsubIdentity()
            unsubCAS()
            unsubIAP()
        }
        // eslint-disable-next-line react-hooks/exhaustive-deps
    }, [])

    const value = useMemo(
        () => ({
            attempt,
            canAccess: !!attempt && isValid(attempt),
            identityData: isValid(idAuth) ? idAuth.data : null,
            casData: isValid(casAuth) ? casAuth.data : null,
            iapData: isValid(iapAuth) ? iapAuth.data : null,
            authCAS,
            authIAP,
            signOutCAS,
            authIdentity,
            signOutIdentity,
        }),
        [attempt, casAuth, idAuth, iapAuth],
    )

    return (
        <AccessContext.Provider value={value}>
            {children}
        </AccessContext.Provider>
    )
}

const useAccess = () => useContext(AccessContext).canAccess
const useIdentity = () => useContext(AccessContext).identityData

export { AccessProvider, useAccess, useIdentity, AccessContext }
