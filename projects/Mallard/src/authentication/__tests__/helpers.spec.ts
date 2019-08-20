import {
    fetchUserDataForKeychainUser,
    canViewEdition,
    UserData,
} from '../helpers'
import { membershipResponse, userResponse, userData } from './fixtures'

const getMockStore = (val?: string) => ({
    get: jest.fn(() =>
        Promise.resolve(
            typeof val !== 'undefined' && {
                service: 's',
                username: 'u',
                password: val,
            },
        ),
    ),
    set: jest.fn(() => Promise.resolve(true)),
    reset: jest.fn(() => Promise.resolve(true)),
})

const withCreds = ({
    email,
    digitalPack,
}: {
    email: string
    digitalPack: boolean
}): UserData => ({
    ...userData,
    userDetails: {
        ...userData.userDetails,
        primaryEmailAddress: email,
    },
    membershipData: {
        ...userData.membershipData,
        contentAccess: {
            ...userData.membershipData.contentAccess,
            digitalPack,
        },
    },
})

const getMockPromise = <T>(val: T) => jest.fn(() => Promise.resolve(val))

describe('helpers', () => {
    describe('fetchUserDataForKeychainUser', () => {
        it('will return null if there is no user token, and will reset all credentials', async () => {
            const membershipStore = getMockStore('token')
            const userStore = getMockStore()
            const fetchMembershipData = getMockPromise(membershipResponse)
            const fetchUserData = getMockPromise(userResponse)
            const fetchMembershipToken = getMockPromise('any')
            const getLegacyUserAccessToken = getMockPromise(false as const)
            const resetMock = getMockPromise(true)

            const data = await fetchUserDataForKeychainUser(
                membershipStore,
                userStore,
                fetchMembershipData,
                fetchUserData,
                fetchMembershipToken,
                getLegacyUserAccessToken,
                resetMock,
            )

            expect(data).toEqual(null)
            expect(userStore.get).toBeCalledTimes(1)
            expect(resetMock).toBeCalledTimes(1)
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
            const getLegacyUserAccessToken = getMockPromise(false as const)
            const resetMock = getMockPromise(true)

            const data = await fetchUserDataForKeychainUser(
                membershipStore,
                userStore,
                fetchMembershipData,
                fetchUserData,
                fetchMembershipToken,
                getLegacyUserAccessToken,
                resetMock,
            )

            expect(data).toEqual({
                userDetails: userResponse,
                membershipData: membershipResponse,
            })
            expect(resetMock).not.toHaveBeenCalled()
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
            const getLegacyUserAccessToken = getMockStore('token').get
            const resetMock = getMockPromise(true)

            const data = await fetchUserDataForKeychainUser(
                membershipStore,
                userStore,
                fetchMembershipData,
                fetchUserData,
                fetchMembershipToken,
                getLegacyUserAccessToken,
                resetMock,
            )

            expect(data).toEqual({
                userDetails: userResponse,
                membershipData: membershipResponse,
            })
            expect(resetMock).not.toHaveBeenCalled()
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
            const getLegacyUserAccessToken = getMockPromise(false as const)
            const resetMock = getMockPromise(true)

            const data = await fetchUserDataForKeychainUser(
                membershipStore,
                userStore,
                fetchMembershipData,
                fetchUserData,
                fetchMembershipToken,
                getLegacyUserAccessToken,
                resetMock,
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
            const getLegacyUserAccessToken = getMockPromise(false as const)
            const resetMock = getMockPromise(true)

            const data = await fetchUserDataForKeychainUser(
                membershipStore,
                userStore,
                fetchMembershipData,
                fetchUserData,
                fetchMembershipToken,
                getLegacyUserAccessToken,
                resetMock,
            )

            expect(data).toEqual({
                userDetails: userResponse,
                membershipData: membershipResponse,
            })

            expect(fetchMembershipData).toBeCalledWith('mtoken')
            expect(fetchMembershipToken).not.toBeCalled()
            expect(membershipStore.set).not.toBeCalled()
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
                        email: 'charlotte@elgrauniad.biz',
                        digitalPack: false,
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
                        email: 'charlotte@elgrauniad.biz',
                        digitalPack: true,
                    }),
                ),
            ).toBe(true)
        })
    })
})
