import { fetchMembershipDataForKeychainUser } from '../helpers'

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

const getMockFetchImpl = <T>(val?: T) => jest.fn(() => Promise.resolve(val))

describe('helpers', () => {
    describe('fetchMembershipDataForKeychainUser', () => {
        it('will look in the membership keychain for the data', async () => {
            const membershipStore = getMockStore('token')
            const userStore = getMockStore()
            const fetchMembershipData = getMockFetchImpl('data')
            const fetchMembershipToken = getMockFetchImpl()

            const data = await fetchMembershipDataForKeychainUser(
                membershipStore,
                userStore,
                fetchMembershipData,
                fetchMembershipToken,
            )

            expect(data).toBe('data')
            expect(fetchMembershipData).toBeCalledTimes(1)
            expect(userStore.get).not.toBeCalled()
            expect(fetchMembershipToken).not.toBeCalled()
        })

        it('will look in the user keychain for the data if there is no members token', async () => {
            const membershipStore = getMockStore()
            const userStore = getMockStore('token')
            const fetchMembershipData = getMockFetchImpl('data')
            const fetchMembershipToken = getMockFetchImpl('mtoken')

            const data = await fetchMembershipDataForKeychainUser(
                membershipStore,
                userStore,
                fetchMembershipData,
                fetchMembershipToken,
            )

            expect(data).toBe('data')
            expect(fetchMembershipData).toBeCalledTimes(1)
            expect(userStore.get).toBeCalledTimes(1)
            expect(fetchMembershipToken).toBeCalledTimes(1)
            expect(membershipStore.set).toBeCalledWith('u', 'mtoken')
        })
    })
})
