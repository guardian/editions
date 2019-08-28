import {
    fetchUserDataForKeychainUser,
    UserData,
    fetchAndPersistCASExpiryForKeychainCredentials,
    fetchAndPersistIAPReceiptForCurrentITunesUser,
} from './helpers'
import { isInTestFlight as getIsInTestFlight } from './release-stream'
import { CasExpiry } from '../services/content-auth-service'
import {
    userDataCache,
    casDataCache,
    legacyCASExpiryCache,
    iapReceiptCache,
} from './storage'
import { ReceiptIOS, isReceiptActive } from '../services/iap'

interface IdentityAuth {
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

export type AuthStatus = Pending | Unauthed | Authed<AuthType>

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

const isIdentity = (type: AuthType): type is IdentityAuth =>
    type.type === 'identity'

const getIdentityData = (status: AuthStatus): UserData | null =>
    (isAuthed(status) && isIdentity(status.data) && status.data.info) || null

/**
 * This takes an array of providers that are thunks that will return a Promise<AuthType | false>
 * if one returns false or throws, the next one will be tried until one passes or we exhaust the chain
 * in which case it will return an anauthed status
 */
const runAuthChain = async (
    providers: (() => Promise<AuthType | false>)[],
): Promise<AuthStatus> => {
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
    (requiresValidReceipt ? isReceiptActive(info) : true) && {
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

const liveAuthChain = (isInTestFlight = getIsInTestFlight()) =>
    runAuthChain([
        identityAuthProvider,
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

const cachedIdentityAuthProvider = (
    userDataCacheImpl: typeof userDataCache,
) => () => userDataCacheImpl.get().then(authTypeFromIdentity)

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

const cachedAuthChain = (
    userDataCacheImpl = userDataCache,
    casDataCacheImpl = casDataCache,
    legacyCASExpiryCacheImpl = legacyCASExpiryCache,
    iapReceiptCacheImpl = iapReceiptCache,
    isInTestFlight = getIsInTestFlight(),
) =>
    runAuthChain([
        cachedIdentityAuthProvider(userDataCacheImpl),
        cachedCasAuthProvider(casDataCacheImpl, legacyCASExpiryCacheImpl),
        cachedIAPAuthProvider(iapReceiptCacheImpl),
        iapBetaFromLiveAuthProvider(isInTestFlight),
    ])

export {
    runAuthChain,
    liveAuthChain,
    cachedAuthChain,
    pending,
    unauthed,
    isPending,
    isAuthed,
    getIdentityData,
    IdentityAuthStatus,
    CASAuthStatus,
    IAPAuthStatus,
    /* exported for testing */
    authTypeFromCAS,
    authTypeFromIAP,
}
