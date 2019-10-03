import { AsyncStorage } from '../../AsyncStorage'
import { Authorizer, AsyncCache } from '../Authorizer'
import { AccessController } from '../AccessController'
import { AnyAttempt } from '../Attempt'
import { AuthResult, ValidResult, InvalidResult } from '../Result'

type UserData = { id: string }

const getValidUserData = async (): Promise<AuthResult<UserData>> =>
    ValidResult({
        id: '123',
    })

const getInvalidUserData = async (): Promise<AuthResult<UserData>> =>
    InvalidResult()

const createSimpleAccessController = ({
    existingOfflineCache = false,
    invalidFromLiveCredentials = false,
    invalidFromCachedCredentials = false,
    grantAccessFromUserData = true,
} = {}) => {
    let attempt: AnyAttempt<string> | null = null

    const handler = (_attempt: AnyAttempt<string>) => {
        attempt = _attempt
    }

    const cache = new AsyncStorage<UserData>(
        existingOfflineCache ? { id: '123' } : undefined,
    )

    const controller = new AccessController({
        a: new Authorizer(
            'a',
            cache,
            [] as AsyncCache<any>[],
            invalidFromLiveCredentials ? getInvalidUserData : getValidUserData,
            invalidFromCachedCredentials
                ? getInvalidUserData
                : getValidUserData,
            () => grantAccessFromUserData,
        ),
    })

    controller.subscribe(handler)

    return {
        cache,
        controller,
        attempt: {
            // this allows us to read an attempt as seen by a subscriber
            get current() {
                return attempt
            },
        },
    }
}

describe('AccessController', () => {
    it('handles errors from an Authorizer', async () => {
        let attempt: AnyAttempt<string> | null = null

        const handler = (_attempt: AnyAttempt<string>) => {
            attempt = _attempt
        }

        const cache = new AsyncStorage<UserData>({ id: '123' })

        const controller = new AccessController({
            a: new Authorizer(
                'a',
                cache,
                [] as AsyncCache<any>[],
                async () => {
                    throw new Error()
                },
                getValidUserData,
                () => true,
            ),
        })

        controller.subscribe(handler)

        await controller.authorizerMap.a.runAuth()

        expect(controller.authorizerMap.a.getAccessAttempt()).toMatchObject({
            type: 'invalid-attempt',
        })

        expect(attempt).toMatchObject({
            connectivity: 'online',
            type: 'invalid-attempt',
        })
    })

    describe('handleConnectionStatusChanged', () => {
        it('the access contoller is initialised with an attempt of not-run', async () => {
            const { attempt } = createSimpleAccessController()

            expect(attempt.current).toMatchObject({
                type: 'not-run-attempt',
            })
        })

        it('runs the offline auth methods when the first connection status is offline', async () => {
            const { controller, attempt } = createSimpleAccessController()

            await controller.handleConnectionStatusChanged(false)

            expect(attempt.current).toMatchObject({
                connectivity: 'offline',
            })
        })

        it('returns an invalid offline attempt if there is nothing in the userData cache of any of the validators', async () => {
            const { controller, attempt } = createSimpleAccessController()

            await controller.handleConnectionStatusChanged(false)

            expect(attempt.current).toMatchObject({
                connectivity: 'offline',
                type: 'invalid-attempt',
            })
        })

        it('returns a valid offline attempt if there is something in the userData cache of any of the validators', async () => {
            const { controller, attempt } = createSimpleAccessController({
                existingOfflineCache: true,
            })

            await controller.handleConnectionStatusChanged(false)

            expect(attempt.current).toMatchObject({
                connectivity: 'offline',
                type: 'valid-attempt',
                data: 'a', // the name of the validator that it succeeded with
            })
        })

        it('replaces offline attempts with online attempts where possible, even if the online attempt invalidates a valid offline attempt', async () => {
            const { controller, attempt } = createSimpleAccessController({
                existingOfflineCache: true,
                invalidFromCachedCredentials: true,
                grantAccessFromUserData: false,
            })

            await controller.handleConnectionStatusChanged(false)
            await controller.handleConnectionStatusChanged(true)

            expect(attempt.current).toMatchObject({
                connectivity: 'online',
                type: 'invalid-attempt',
            })
        })

        it('does not replace online attempts with offline attempts, even if the offline attempt validates an invalid offline attempt', async () => {
            const { controller, attempt } = createSimpleAccessController({
                existingOfflineCache: true,
                invalidFromCachedCredentials: true,
                grantAccessFromUserData: false,
            })

            await controller.handleConnectionStatusChanged(true)
            await controller.handleConnectionStatusChanged(false)

            expect(attempt.current).toMatchObject({
                connectivity: 'online',
                type: 'invalid-attempt',
            })
        })
    })

    describe('authorizerMap', () => {
        it('updates the access controller when auth is called from the authorizer map', async () => {
            const { controller, attempt } = createSimpleAccessController({
                existingOfflineCache: true,
            })

            await controller.authorizerMap.a.runAuth()

            expect(attempt.current).toMatchObject({
                connectivity: 'online',
                type: 'valid-attempt',
            })
        })

        it('allows arguments to be passed to the auth function', async () => {
            let arg: string | null = null
            const cache = new AsyncStorage<UserData>({ id: '123' })
            const controller = new AccessController({
                a: new Authorizer(
                    'a',
                    cache,
                    [] as AsyncCache<any>[],
                    async ([a]: [string]) => {
                        arg = a
                        return ValidResult({
                            id: '123',
                        })
                    },
                    getValidUserData,
                    () => true,
                ),
            })

            await controller.authorizerMap.a.runAuth('sstring')

            expect(arg).toBe('sstring')
        })
    })

    describe('checkUserHasAccess', () => {
        it('validates user data from an authorizer to allow them to be logged in via that authorizer, yet still not granting access', async () => {
            const { controller, attempt } = createSimpleAccessController({
                grantAccessFromUserData: false,
            })

            await controller.authorizerMap.a.runAuth()

            expect(controller.authorizerMap.a.getUserData()).toMatchObject({
                id: '123',
            })

            expect(attempt.current).toMatchObject({
                connectivity: 'online',
                type: 'invalid-attempt',
            })
        })
    })

    describe('userDataCache', () => {
        it('is populated with the successful auth values after valid auths', async () => {
            const { controller, cache } = createSimpleAccessController({
                grantAccessFromUserData: false,
            })

            await expect(cache.get()).resolves.toBe(null)

            await controller.authorizerMap.a.runAuth()

            await expect(cache.get()).resolves.toMatchObject({ id: '123' })
        })

        it('is purged after invalid auths', async () => {
            const { controller, cache } = createSimpleAccessController({
                grantAccessFromUserData: false,
                invalidFromLiveCredentials: true,
                existingOfflineCache: true,
            })

            await expect(cache.get()).resolves.toMatchObject({ id: '123' })

            await controller.authorizerMap.a.runAuth()

            await expect(cache.get()).resolves.toBe(null)
        })
    })

    describe('asyncCaches', () => {
        it('is purged after erroring auth requests', async () => {
            const cache = new AsyncStorage<UserData>()
            const cacheA = new AsyncStorage('a')
            const cacheB = new AsyncStorage(1)
            const controller = new AccessController({
                a: new Authorizer(
                    'a',
                    cache,
                    [cacheA, cacheB] as const,
                    async () => {
                        throw new Error()
                    },
                    getValidUserData,
                    () => false,
                ),
            } as const)

            await expect(cacheA.get()).resolves.toEqual('a')
            await expect(cacheB.get()).resolves.toEqual(1)

            await controller.authorizerMap.a.runAuth()

            await expect(cacheA.get()).resolves.toBe(null)
            await expect(cacheB.get()).resolves.toBe(null)
        })
    })
})
