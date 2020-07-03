import fetchMock from 'fetch-mock'
import { defaultSettings } from 'src/helpers/settings/defaults'
import { selectedEditionCache, editionsListCache } from 'src/helpers/storage'
import { defaultRegionalEditions } from '../../../../Apps/common/src/editions-defaults'
import {
    BASE_EDITION,
    DEFAULT_EDITIONS_LIST,
    fetchEditions,
    getEditions,
    getSelectedEditionSlug,
} from '../use-edition-provider'

jest.mock('@react-native-community/netinfo', () => ({
    fetch: jest.fn(() => Promise.resolve({ isConnected: true })),
}))

describe('useEditions', () => {
    describe('getSelectedEditionSlug', () => {
        beforeEach(async () => {
            await selectedEditionCache.reset()
        })
        it('should return the default slug as there is nothing in Async Storage', async () => {
            const editionSlug = await getSelectedEditionSlug()
            expect(editionSlug).toEqual(BASE_EDITION.edition)
        })
        it('should return "american-edition" slug when the US edition is set', async () => {
            await selectedEditionCache.set(defaultRegionalEditions[2])
            const editionSlug = await getSelectedEditionSlug()
            expect(editionSlug).toEqual('american-edition')
        })
    })

    describe('fetchEditions', () => {
        it('should return json if there is a 200 response from the endpoint', async () => {
            const body = DEFAULT_EDITIONS_LIST

            fetchMock.getOnce(defaultSettings.editionsUrl, {
                status: 200,
                body,
            })
            const editionsList = await fetchEditions()
            expect(editionsList).toEqual(body)
        })
        it('should return null if there is not a 200 response from the endpoint', async () => {
            fetchMock.getOnce(
                defaultSettings.editionsUrl,
                {
                    status: 500,
                },
                { overwriteRoutes: false },
            )
            const editionsList = await fetchEditions()
            expect(editionsList).toEqual(null)
        })
    })

    describe('getEditions', () => {
        // Dont forget Offline
        beforeEach(async () => {
            await editionsListCache.reset()
        })
        it('should return the editions list from the endpoint in the happy path', async () => {
            const body = DEFAULT_EDITIONS_LIST

            fetchMock.getOnce(
                defaultSettings.editionsUrl,
                {
                    status: 200,
                    body,
                },
                { overwriteRoutes: false },
            )

            const editions = await getEditions()
            const editionsListInCache = await editionsListCache.get()
            expect(editions).toEqual(body)
            expect(editionsListInCache).toEqual(body)
        })
        it('should return the editions list from the cache if endpoint is not avaialble', async () => {
            fetchMock.getOnce(
                defaultSettings.editionsUrl,
                {
                    status: 500,
                },
                { overwriteRoutes: false },
            )
            await editionsListCache.set(DEFAULT_EDITIONS_LIST)

            const editions = await getEditions()
            expect(editions).toEqual(DEFAULT_EDITIONS_LIST)
        })
        it('should return the default editions list if there is nothing from the endpoint and no cache', async () => {
            fetchMock.getOnce(
                defaultSettings.editionsUrl,
                {
                    status: 500,
                },
                { overwriteRoutes: false },
            )

            const editions = await getEditions()
            expect(editions).toEqual(DEFAULT_EDITIONS_LIST)
        })
    })
})
