import { fetchUserDataForKeychainUser } from '../helpers'

const membershipResponse = {
    userId: 'uid',
    showSupportMessaging: true,
    contentAccess: {
        member: false,
        paidMember: false,
        recurringContributor: false,
        digitalPack: false,
        paperSubscriber: false,
        guardianWeeklySubscriber: false,
    },
}

const userResponse = {
    id: '123',
    dates: {
        accountCreatedDate: '2019',
    },
    adData: {},
    consents: [],
    userGroups: [],
    socialLinks: [],
    publicFields: {
        displayName: 'User Name',
    },
    statusFields: {
        hasRepermissioned: false,
        userEmailValidated: true,
        allowThirdPartyProfiling: false,
    },
    primaryEmailAddress: 'username@example.com',
    hasPassword: true,
}

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

const getMockPromise = <T>(val: T) => jest.fn(() => Promise.resolve(val))

describe('helpers', () => {
    describe('fetchUserDataForKeychainUser', () => {
        it('will return null if there is no user token, and will reset all credentials', async () => {
            const membershipStore = getMockStore('token')
            const userStore = getMockStore()
            const fetchMembershipData = getMockPromise(membershipResponse)
            const fetchUserData = getMockPromise(userResponse)
            const fetchMembershipToken = getMockPromise('any')
            const resetMock = getMockPromise(true)

            const data = await fetchUserDataForKeychainUser(
                membershipStore,
                userStore,
                fetchMembershipData,
                fetchUserData,
                fetchMembershipToken,
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
            const resetMock = getMockPromise(true)

            const data = await fetchUserDataForKeychainUser(
                membershipStore,
                userStore,
                fetchMembershipData,
                fetchUserData,
                fetchMembershipToken,
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
            const resetMock = getMockPromise(true)

            const data = await fetchUserDataForKeychainUser(
                membershipStore,
                userStore,
                fetchMembershipData,
                fetchUserData,
                fetchMembershipToken,
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
            const resetMock = getMockPromise(true)

            const data = await fetchUserDataForKeychainUser(
                membershipStore,
                userStore,
                fetchMembershipData,
                fetchUserData,
                fetchMembershipToken,
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
})
