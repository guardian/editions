import {
    fetchUserDataForKeychainUser,
    UserData,
    fetchAndPersistCASExpiryForKeychainCredentials,
    fetchAndPersistIAPReceiptForCurrentITunesUser,
} from './helpers'
import { isInTestFlight as getIsInTestFlight } from '../helpers/release-stream'
import { CasExpiry } from '../services/content-auth-service'
import {
    userDataCache,
    casDataCache,
    legacyCASExpiryCache,
    iapReceiptCache,
} from '../helpers/storage'
import { ReceiptIOS, isReceiptActive } from '../services/iap'

export interface IdentityAuth {
    type: 'identity'
    info: UserData
}

interface CASAuth {
    type: 'cas'
    info: CasExpiry
}

// eslint-disable-next-line
interface IAPAuth {
    type: 'iap'
    info: ReceiptIOS
}

const IdentityAuthStatus = (info: UserData): Authed<IdentityAuth> => ({
    type: 'authed',
    data: {
        type: 'identity',
        info,
    },
})

const CASAuthStatus = (info: CasExpiry): Authed<CASAuth> => ({
    type: 'authed',
    data: {
        type: 'cas',
        info,
    },
})

const IAPAuthStatus = (info: ReceiptIOS): Authed<IAPAuth> => ({
    type: 'authed',
    data: {
        type: 'iap',
        info,
    },
})

export type AuthType = IdentityAuth | CASAuth | IAPAuth

interface Pending {
    type: 'pending'
}

interface Unauthed {
    type: 'unauthed'
}

interface Authed<Type> {
    type: 'authed'
    data: Type
}

type AnyAuthed = Authed<AuthType>

export type AuthStatus<AT = AuthType> = Pending | Unauthed | Authed<AT>

const unauthed: Unauthed = {
    type: 'unauthed',
}

const pending: Pending = {
    type: 'pending',
}

const isAuthed = (status: AuthStatus): status is AnyAuthed =>
    status.type === 'authed'

const isPending = (status: AuthStatus): status is Pending =>
    status.type === 'pending'

const isIdentity = (status: AuthStatus): status is Authed<IdentityAuth> =>
    isAuthed(status) && status.data.type === 'identity'

const isIAP = (status: AuthStatus): status is Authed<IAPAuth> =>
    isAuthed(status) && status.data.type === 'iap'

const isCAS = (status: AuthStatus): status is Authed<CASAuth> =>
    isAuthed(status) && status.data.type === 'cas'

const getIdentityData = (status: AuthStatus): UserData | null =>
    (isIdentity(status) && status.data.info) || null

/**
 * This takes an array of providers that are thunks that will return a Promise<AuthType | false>
 * if one returns false or throws, the next one will be tried until one passes or we exhaust the chain
 * in which case it will return an anauthed status
 */
const runAuthChain = async <AT = AuthType>(
    providers: (() => Promise<AT | false>)[],
): Promise<AuthStatus<AT>> => {
    for (const provider of providers) {
        try {
            const res = await provider()
            if (res) return { type: 'authed', data: res }
        } catch (e) {
            // ignore errors here
        }
    }
    return unauthed
}

const authTypeFromIdentity = (info: UserData | null): IdentityAuth | false =>
    !!info && {
        type: 'identity',
        info,
    }

const authTypeFromCAS = (info: CasExpiry | null): CASAuth | false =>
    !!info &&
    new Date(info.expiryDate).getTime() > Date.now() && {
        type: 'cas',
        info,
    }

const authTypeFromIAP = (
    info: ReceiptIOS | null,
    { requiresValidReceipt = true } = {},
): IAPAuth | false =>
    !!info &&
    (!requiresValidReceipt || isReceiptActive(info)) && {
        type: 'iap',
        info,
    }

/**
 * Live
 *
 * This chain is expected to use cached credential tokens to query the backend
 * endpoints that will refresh their authentication status
 * */

const identityAuthProvider = () =>
    fetchUserDataForKeychainUser().then(authTypeFromIdentity)

const identityAuthChain = () => runAuthChain([identityAuthProvider])

const casAuthProvider = () =>
    fetchAndPersistCASExpiryForKeychainCredentials().then(authTypeFromCAS)

const iapAuthProvider = () =>
    fetchAndPersistIAPReceiptForCurrentITunesUser().then(authTypeFromIAP)

// if we are in testflight and re have an IAP receipt then let them in!
// because we have changed streams the appBundleReceiptURL will be pointing
// to a different place, meaning we can't go and fetch the actual receipt
// and instead have to read from the cache
const iapBetaFromLiveAuthProvider = (isInTestFlight: boolean) => async () => {
    if (!isInTestFlight) return false
    const receipt = await iapReceiptCache.get()
    return authTypeFromIAP(receipt, { requiresValidReceipt: false })
}

const nonIdentityAuthChain = (isInTestFlight = getIsInTestFlight()) =>
    runAuthChain<AuthType>([
        casAuthProvider,
        iapAuthProvider,
        iapBetaFromLiveAuthProvider(isInTestFlight),
    ])

/**
 * Cached
 *
 * This chain is expected to use caches of existing auth responses for the case when
 * the user is offline, i.e. it never hits a backend endpoint.
 *
 * We could always allow a user to be authed when offline as their might be an assumption
 * that "they can't download anything anyway because they're offline". However, we do download
 * stuff whether they're authenticated or not when they _are_ online so they could just turn off
 * data and re-open the app to read the new content.
 * */

const cachedIdentityAuthProvider = () =>
    userDataCache.get().then(authTypeFromIdentity)

const cachedIdentityAuthChain = () => runAuthChain([cachedIdentityAuthProvider])

const cachedCasAuthProvider = (
    casDataCacheImpl: typeof casDataCache,
    legacyCASExpiryCacheImpl: typeof legacyCASExpiryCache,
) => async () => {
    const auth = await casDataCacheImpl.get().then(authTypeFromCAS)
    return auth || authTypeFromCAS(legacyCASExpiryCacheImpl.get() || null)
}

const cachedIAPAuthProvider = (
    iapReceiptCacheImpl: typeof iapReceiptCache,
) => () => iapReceiptCacheImpl.get().then(authTypeFromIAP)

const cachedNonIdentityAuthChain = (
    casDataCacheImpl = casDataCache,
    legacyCASExpiryCacheImpl = legacyCASExpiryCache,
    iapReceiptCacheImpl = iapReceiptCache,
    isInTestFlight = getIsInTestFlight(),
) =>
    runAuthChain<AuthType>([
        cachedCasAuthProvider(casDataCacheImpl, legacyCASExpiryCacheImpl),
        cachedIAPAuthProvider(iapReceiptCacheImpl),
        iapBetaFromLiveAuthProvider(isInTestFlight),
    ])

export {
    runAuthChain,
    // live credentials runners
    identityAuthChain,
    nonIdentityAuthChain,
    // cached credentials runners
    cachedIdentityAuthChain,
    cachedNonIdentityAuthChain,
    // helpers
    pending,
    unauthed,
    isPending,
    isAuthed,
    isIdentity,
    isIAP,
    isCAS,
    getIdentityData,
    IdentityAuthStatus,
    CASAuthStatus,
    IAPAuthStatus,
    /* exported for testing */
    authTypeFromCAS,
    authTypeFromIAP,
}
