import {
    runAuthChain,
    IdentityAuthStatus,
    CASAuthStatus,
    isAuthed,
    authTypeFromCAS,
    authTypeFromIAP,
    cachedNonIdentityAuthChain,
    IAPAuthStatus,
    unauthed,
    AuthType,
} from '../credentials-chain'
import { userData, casExpiry, receiptIOS } from './fixtures'
import {
    getMockAsyncCache,
    getMockCache,
    tomorrow,
    yesterday,
} from '../../test-helpers/test-helpers'

/**
 * This helper ensures an ordering or resolving promises, any promise
 * created with this will resolve before any others created with a higher order
 * It's useful to show that the chain runs in serial rather than in parallel
 *
 *  e.g. the below passes (when using Promise.race)
 *  ```js
 *  const val = await Promise.race([
 *     createOrderPromise(2, IdentityAuthStatus(userData).data),
 *     createOrderPromise(1, CASAuthStatus(casExpiry()).data),
 *  ])
 *  expect(val.type).toBe('cas')
 * ```
 */
const createOrderPromise = async <T>(priority: number, val: T): Promise<T> => {
    if (priority <= 1) return Promise.resolve(val)
    return Promise.resolve(createOrderPromise(priority - 1, val))
}

describe('credentials-chain', () => {
    describe('runAuthChain', () => {
        it('runs the chain in serial', async () => {
            const res: any = await runAuthChain<AuthType>([
                () => createOrderPromise(2, IdentityAuthStatus(userData).data),
                () => createOrderPromise(1, CASAuthStatus(casExpiry()).data),
            ])

            expect(isAuthed(res)).toBe(true)
            expect(res.data.type).toBe('identity')
        })

        it('returns the value of the first truthy Promise in the chain', async () => {
            const res: any = await runAuthChain<AuthType>([
                async () => IdentityAuthStatus(userData).data,
                async () => CASAuthStatus(casExpiry()).data,
            ])

            expect(isAuthed(res)).toBe(true)
            expect(res.data.type).toBe('identity')
        })

        it('ignores errors and tries the next provider', async () => {
            const res: any = await runAuthChain([
                async () => {
                    throw new Error()
                },
                async () => CASAuthStatus(casExpiry()).data,
            ])

            expect(res.data.type).toBe('cas')
        })

        it('tries the next provider if the current one returns false', async () => {
            const res: any = await runAuthChain([
                async () => false,
                async () => CASAuthStatus(casExpiry()).data,
            ])

            expect(res.data.type).toBe('cas')
        })

        it('returns unauthed if no provider returns a truth value', async () => {
            const res: any = await runAuthChain([
                async () => false,
                async () => {
                    throw new Error()
                },
            ])

            expect(isAuthed(res)).not.toBe(true)
        })
    })

    describe('authTypeFromCAS', () => {
        it('returns a CAS auth when the expiry is in the future', () => {
            expect(
                authTypeFromCAS(casExpiry({ expiryDate: '2025-12-12' })),
            ).toMatchObject({
                type: 'cas',
            })
        })

        it('returns false when the CAS expiry is in the past', () => {
            expect(
                authTypeFromCAS(casExpiry({ expiryDate: '2012-12-12' })),
            ).toBe(false)
        })
    })

    describe('authTypeFromIAP', () => {
        it('returns an IAP auth when the IAP receipt expiry is in the future', () => {
            expect(
                authTypeFromIAP(
                    receiptIOS({
                        expires_date: tomorrow(),
                    }),
                ),
            ).toMatchObject({
                type: 'iap',
            })
        })

        it('returns false when the IAP receipt expiry is in the past', () => {
            expect(
                authTypeFromIAP(
                    receiptIOS({
                        expires_date: yesterday(),
                    }),
                ),
            ).toBe(false)
        })
    })

    describe('cachedNonIdentityAuthChain', () => {
        const invalidCasExpiry = casExpiry({
            expiryDate: yesterday().toString(),
        })
        const validCasExpiry = casExpiry({
            expiryDate: tomorrow().toString(),
        })
        const invalidIAPReceipt = receiptIOS({
            expires_date: yesterday(),
        })
        const validIAPReceipt = receiptIOS({
            expires_date: tomorrow(),
        })

        it('returns a `cas` auth when there is something valid in the identity cache but nothing in the identity cache', async () => {
            const casDataCache = getMockAsyncCache(validCasExpiry)
            const legacyCasExpiryCache = getMockCache(casExpiry())
            const iapReceiptCache = getMockAsyncCache(validIAPReceipt)

            const result = await cachedNonIdentityAuthChain(
                casDataCache,
                legacyCasExpiryCache,
                iapReceiptCache,
                false,
            )

            expect(result).toEqual(CASAuthStatus(validCasExpiry))
        })

        it('returns a `cas` auth from the legacy cache when there is nothing valid in the identity cache or the new cas cache', async () => {
            const casDataCache = getMockAsyncCache(invalidCasExpiry)
            const legacyCasExpiryCache = getMockCache(validCasExpiry)
            const iapReceiptCache = getMockAsyncCache(validIAPReceipt)

            const result = await cachedNonIdentityAuthChain(
                casDataCache,
                legacyCasExpiryCache,
                iapReceiptCache,
                false,
            )

            expect(result).toEqual(CASAuthStatus(validCasExpiry))
        })

        it('returns an `iap` auth when all of the previous caches are invalid', async () => {
            const casDataCache = getMockAsyncCache(invalidCasExpiry)
            const legacyCasExpiryCache = getMockCache(invalidCasExpiry)
            const iapReceiptCache = getMockAsyncCache(validIAPReceipt)

            const result = await cachedNonIdentityAuthChain(
                casDataCache,
                legacyCasExpiryCache,
                iapReceiptCache,
                false,
            )

            expect(result).toEqual(IAPAuthStatus(validIAPReceipt))
        })

        it('returns `unauthed` when all of the caches are invalid', async () => {
            const casDataCache = getMockAsyncCache(invalidCasExpiry)
            const legacyCasExpiryCache = getMockCache(invalidCasExpiry)
            const iapReceiptCache = getMockAsyncCache(invalidIAPReceipt)

            const result = await cachedNonIdentityAuthChain(
                casDataCache,
                legacyCasExpiryCache,
                iapReceiptCache,
                false,
            )

            expect(result).toEqual(unauthed)
        })

        it('returns an `iap` when we have only an expired iap receipt and are in testflight', async () => {
            const casDataCache = getMockAsyncCache(invalidCasExpiry)
            const legacyCasExpiryCache = getMockCache(invalidCasExpiry)
            const iapReceiptCache = getMockAsyncCache(invalidIAPReceipt)

            const result = await cachedNonIdentityAuthChain(
                casDataCache,
                legacyCasExpiryCache,
                iapReceiptCache,
                true,
            )

            expect(result).toEqual(unauthed)
        })

        it('returns `unauthed` when we have only no iap receipt and are in testflight', async () => {
            const casDataCache = getMockAsyncCache(invalidCasExpiry)
            const legacyCasExpiryCache = getMockCache(invalidCasExpiry)
            const iapReceiptCache = getMockAsyncCache(null)

            const result = await cachedNonIdentityAuthChain(
                casDataCache,
                legacyCasExpiryCache,
                iapReceiptCache,
                true,
            )

            expect(result).toEqual(unauthed)
        })
    })
})
