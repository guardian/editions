import { fetchUserDataForKeychainUser, canViewEdition } from '../helpers'
import { membershipResponse, userResponse, withCreds } from './fixtures'
import {
    getMockPromise,
    getMockStore,
    getMockAsyncCache,
} from '../../test-helpers/test-helpers'
import { Error401 } from 'src/services/exceptions'

describe('helpers', () => {
    describe('fetchUserDataForKeychainUser', () => {
        it('will return null if there is no user token, and will reset all credentials', async () => {
            const membershipStore = getMockStore('token')
            const userStore = getMockStore()
            const fetchMembershipData = getMockPromise(membershipResponse)
            const fetchUserData = getMockPromise(userResponse)
            const fetchMembershipToken = getMockPromise('any')
            const userDataStore = getMockAsyncCache(null)
            const legacyUserDataStore = getMockStore()

            const data = await fetchUserDataForKeychainUser(
                membershipStore,
                userStore,
                fetchMembershipData,
                fetchUserData,
                fetchMembershipToken,
                userDataStore,
                legacyUserDataStore,
            )

            expect(data).toEqual(null)
            expect(userStore.get).toBeCalledTimes(1)
            expect(userDataStore.reset).toBeCalledTimes(1)
            expect(legacyUserDataStore.reset).toBeCalledTimes(1)
            expect(fetchMembershipData).not.toBeCalled()
            expect(fetchMembershipToken).not.toBeCalled()
            expect(fetchUserData).not.toBeCalled()
        })

        it('queries the membership and user data when it finds a user token', async () => {
            const membershipStore = getMockStore('mtoken')
            const userStore = getMockStore('token')
            const fetchMembershipData = getMockPromise(membershipResponse)
            const fetchUserData = getMockPromise(userResponse)
            const fetchMembershipToken = getMockPromise('mtoken')
            const userDataStore = getMockAsyncCache(null)
            const legacyUserDataStore = getMockStore()

            const data = await fetchUserDataForKeychainUser(
                membershipStore,
                userStore,
                fetchMembershipData,
                fetchUserData,
                fetchMembershipToken,
                userDataStore,
                legacyUserDataStore,
            )

            expect(data).toEqual({
                userDetails: userResponse,
                membershipData: membershipResponse,
            })
            expect(userDataStore.reset).not.toHaveBeenCalled()
            expect(userDataStore.reset).not.toHaveBeenCalled()
            expect(userStore.get).toBeCalledTimes(1)
            expect(fetchUserData).toBeCalledTimes(1)
            expect(fetchMembershipData).toBeCalledTimes(1)
        })

        it('queries the membership and user data when it finds a legacy user token', async () => {
            const membershipStore = getMockStore('mtoken')
            const userStore = getMockStore()
            const fetchMembershipData = getMockPromise(membershipResponse)
            const fetchUserData = getMockPromise(userResponse)
            const fetchMembershipToken = getMockPromise('mtoken')
            const userDataStore = getMockAsyncCache(null)
            const legacyUserDataStore = getMockStore('token')

            const data = await fetchUserDataForKeychainUser(
                membershipStore,
                userStore,
                fetchMembershipData,
                fetchUserData,
                fetchMembershipToken,
                userDataStore,
                legacyUserDataStore,
            )

            expect(data).toEqual({
                userDetails: userResponse,
                membershipData: membershipResponse,
            })
            expect(userDataStore.reset).not.toHaveBeenCalled()
            expect(legacyUserDataStore.reset).not.toHaveBeenCalled()
            expect(userStore.get).toBeCalledTimes(1)
            expect(fetchUserData).toBeCalledTimes(1)
            expect(fetchMembershipData).toBeCalledTimes(1)
        })

        it('will fetch a new membership token if it does not exist', async () => {
            const membershipStore = getMockStore()
            const userStore = getMockStore('token')
            const fetchMembershipData = getMockPromise(membershipResponse)
            const fetchUserData = getMockPromise(userResponse)
            const fetchMembershipToken = getMockPromise('mtoken')
            const userDataStore = getMockAsyncCache(null)
            const legacyUserDataStore = getMockStore()

            const data = await fetchUserDataForKeychainUser(
                membershipStore,
                userStore,
                fetchMembershipData,
                fetchUserData,
                fetchMembershipToken,
                userDataStore,
                legacyUserDataStore,
            )

            expect(data).toEqual({
                userDetails: userResponse,
                membershipData: membershipResponse,
            })

            expect(fetchMembershipData).toBeCalledTimes(1)
            expect(fetchMembershipToken).toBeCalledTimes(1)
            expect(membershipStore.set).toBeCalledWith('u', 'mtoken')
        })

        it('will not fetch a new membership token if it already exists', async () => {
            const membershipStore = getMockStore('mtoken')
            const userStore = getMockStore('token')
            const fetchMembershipData = getMockPromise(membershipResponse)
            const fetchUserData = getMockPromise(userResponse)
            const fetchMembershipToken = getMockPromise('mtoken')
            const userDataStore = getMockAsyncCache(null)
            const legacyUserDataStore = getMockStore()

            const data = await fetchUserDataForKeychainUser(
                membershipStore,
                userStore,
                fetchMembershipData,
                fetchUserData,
                fetchMembershipToken,
                userDataStore,
                legacyUserDataStore,
            )

            expect(data).toEqual({
                userDetails: userResponse,
                membershipData: membershipResponse,
            })

            expect(fetchMembershipData).toBeCalledWith('mtoken')
            expect(fetchMembershipToken).not.toBeCalled()
            expect(membershipStore.set).not.toBeCalled()
        })

        it('clears the caches after a membership fetch error', async () => {
            const membershipStore = getMockStore('mtoken')
            const userStore = getMockStore('utoken')
            const fetchMembershipData = jest.fn(async () => {
                await Promise.resolve()
                throw new Error401()
            })
            const fetchUserData = getMockPromise(userResponse)
            const fetchMembershipToken = getMockPromise('mtoken')
            const userDataStore = getMockAsyncCache(null)
            const legacyUserDataStore = getMockStore()

            const data = fetchUserDataForKeychainUser(
                membershipStore,
                userStore,
                fetchMembershipData,
                fetchUserData,
                fetchMembershipToken,
                userDataStore,
                legacyUserDataStore,
            )

            await expect(data).rejects.toThrow(Error401)
            expect(membershipStore.reset).toHaveBeenCalled()
            expect(fetchMembershipData).toBeCalledTimes(1)
        })

        it('clears the caches after an identity fetch error', async () => {
            const membershipStore = getMockStore('mtoken')
            const userStore = getMockStore('utoken')
            const fetchMembershipData = getMockPromise(membershipResponse)
            const fetchUserData = jest.fn(async () => {
                await Promise.resolve()
                throw new Error401()
            })
            const fetchMembershipToken = getMockPromise('mtoken')
            const userDataStore = getMockAsyncCache(null)
            const legacyUserDataStore = getMockStore()

            const data = fetchUserDataForKeychainUser(
                membershipStore,
                userStore,
                fetchMembershipData,
                fetchUserData,
                fetchMembershipToken,
                userDataStore,
                legacyUserDataStore,
            )

            await expect(data).rejects.toThrow(Error401)
            expect(userStore.reset).toHaveBeenCalled()
            expect(legacyUserDataStore.reset).toHaveBeenCalled()
            expect(fetchUserData).toBeCalledTimes(1)
        })
    })

    describe('isStaffMember', () => {
        it('returns true for a validated guardian email', () => {
            expect(
                canViewEdition(
                    withCreds({
                        email: 'alice@guardian.co.uk',
                        digitalPack: false,
                    }),
                ),
            ).toBe(true)
        })

        it('returns false for an unvalidated guardian email', () => {
            expect(
                canViewEdition(
                    withCreds({
                        email: 'bob@guardian.co.uk',
                        digitalPack: false,
                        userEmailValidated: false,
                    }),
                ),
            ).toBe(false)
        })

        it('returns false for a validated non-guardian email', () => {
            expect(
                canViewEdition(
                    withCreds({
                        email: 'clarissa@grauniad.co.uk',
                        digitalPack: false,
                    }),
                ),
            ).toBe(false)
        })

        it('returns false for an unvalidated non-guardian email', () => {
            expect(
                canViewEdition(
                    withCreds({
                        email: 'desmond@grauniad.co.uk',
                        digitalPack: false,
                        userEmailValidated: false,
                    }),
                ),
            ).toBe(false)
        })
    })

    describe('canViewEdition', () => {
        it('allows people in with guardian email addresses', () => {
            expect(
                canViewEdition(
                    withCreds({
                        email: 'alice@guardian.co.uk',
                        digitalPack: false,
                    }),
                ),
            ).toBe(true)

            expect(
                canViewEdition(
                    withCreds({
                        email: 'bob@theguardian.com',
                        digitalPack: false,
                    }),
                ),
            ).toBe(true)

            expect(
                canViewEdition(
                    withCreds({
                        email: 'charlotte@gu.com',
                        digitalPack: false,
                    }),
                ),
            ).toBe(false)
        })

        it('disallows people with unvalidated guardian email addresses', () => {
            expect(
                canViewEdition(
                    withCreds({
                        email: 'alice@guardian.co.uk',
                        digitalPack: false,
                        userEmailValidated: false,
                    }),
                ),
            ).toBe(false)

            expect(
                canViewEdition(
                    withCreds({
                        email: 'bob@theguardian.com',
                        digitalPack: false,
                        userEmailValidated: false,
                    }),
                ),
            ).toBe(false)

            expect(
                canViewEdition(
                    withCreds({
                        email: 'charlotte@gu.com',
                        digitalPack: false,
                        userEmailValidated: false,
                    }),
                ),
            ).toBe(false)
        })

        it('allows anyone to login with a digital pack', () => {
            expect(
                canViewEdition(
                    withCreds({
                        email: 'alice@guardian.co.uk',
                        digitalPack: true,
                    }),
                ),
            ).toBe(true)

            expect(
                canViewEdition(
                    withCreds({
                        email: 'bob@theguardian.com',
                        digitalPack: true,
                    }),
                ),
            ).toBe(true)

            expect(
                canViewEdition(
                    withCreds({
                        email: 'charlotte@gu.com',
                        digitalPack: true,
                    }),
                ),
            ).toBe(true)
        })
    })
})
