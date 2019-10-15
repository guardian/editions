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

const AccessContext = createContext({
    attempt: NotRun as AnyAttempt<string>,
    canAccess: false,
    authIdentity: (
        // eslint-disable-next-line @typescript-eslint/no-unused-vars
        params: AuthParams,
    ): Promise<ResolvedAttempt<IdentityAuthData>> =>
        Promise.resolve(InvalidAttempt('offline')),
    authCAS: (
        // eslint-disable-next-line @typescript-eslint/no-unused-vars
        subscriberId: string,
        // eslint-disable-next-line @typescript-eslint/no-unused-vars
        password: string,
    ): Promise<ResolvedAttempt<CASExpiry>> =>
        Promise.resolve(InvalidAttempt('offline')),
    authIAP: (): Promise<ResolvedAttempt<ReceiptIOS>> =>
        Promise.resolve(InvalidAttempt('offline')),
    idenityData: null as IdentityAuthData | null,
    casData: null as CASExpiry | null,
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
    const [attempt, setAttempt] = useState<AnyAttempt<string>>(
        controller.getAttempt(),
    )
    const [idAuth, setIdAuth] = useState<AnyAttempt<IdentityAuthData>>(
        controller.authorizerMap.identity.getAttempt(),
    )
    const [casAuth, setCASAuth] = useState<AnyAttempt<CASExpiry>>(
        controller.authorizerMap.cas.getAttempt(),
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
        NetInfo.addEventListener(info =>
            controller.handleConnectionStatusChanged(info.isConnected),
        )
        return () => {
            unsubController()
            unsubIdentity()
            unsubCAS()
        }
        // (ignored 15/10/19)
        // eslint-disable-next-line
    }, [])

    const value = useMemo(
        () => ({
            attempt,
            canAccess: !!attempt && isValid(attempt),
            idenityData: isValid(idAuth) ? idAuth.data : null,
            casData: isValid(casAuth) ? casAuth.data : null,
            authCAS,
            authIAP,
            signOutCAS,
            authIdentity,
            signOutIdentity,
        }),
        [attempt, casAuth, idAuth],
    )

    return (
        <AccessContext.Provider value={value}>
            {children}
        </AccessContext.Provider>
    )
}

const useAccess = () => useContext(AccessContext).canAccess
const useIdentity = () => useContext(AccessContext).idenityData

export { AccessProvider, useAccess, useIdentity, AccessContext }
