import fetchMock from 'fetch-mock'
import { defaultSettings } from 'src/helpers/settings/defaults'
import {
    defaultEditionCache,
    editionsListCache,
    selectedEditionCache,
} from 'src/helpers/storage'
import { defaultRegionalEditions } from '../../../../Apps/common/src/editions-defaults'
import {
    BASE_EDITION,
    defaultEditionDecider,
    DEFAULT_EDITIONS_LIST,
    fetchEditions,
    getEditions,
    getSelectedEditionSlug,
    getDefaultEdition,
} from '../use-edition-provider'

jest.mock('@react-native-community/netinfo', () => ({
    fetch: jest.fn(() => Promise.resolve({ isConnected: true })),
}))

jest.mock('src/services/remote-config', () => ({
    remoteConfigService: {
        getBoolean: jest.fn().mockReturnValue(true),
    },
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
        it('should return "australian-edition" slug when the AU edition is set', async () => {
            await selectedEditionCache.set(defaultRegionalEditions[1])
            const editionSlug = await getSelectedEditionSlug()
            expect(editionSlug).toEqual('australian-edition')
        })
    })

    describe('fetchEditions', () => {
        it('should return json if there is a 200 response from the endpoint', async () => {
            const body = DEFAULT_EDITIONS_LIST

            fetchMock.getOnce(defaultSettings.editionsUrl, {
                status: 200,
                body,
            })
            const editionsList = await fetchEditions(
                defaultSettings.editionsUrl,
            )
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
            const editionsList = await fetchEditions(
                defaultSettings.editionsUrl,
            )
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

    describe('defaultEditionDecider', () => {
        beforeEach(async () => {
            await defaultEditionCache.reset()
            await selectedEditionCache.reset()
        })
        it('should set default and selected edition local state as well as selected storage if found in default storage', async () => {
            const defaultLocalState = jest.fn()
            const selectedLocalState = jest.fn()
            const editionsList = {
                regionalEditions: defaultRegionalEditions,
                specialEditions: [],
            }
            defaultEditionCache.set(defaultRegionalEditions[1])

            await defaultEditionDecider(
                defaultLocalState,
                selectedLocalState,
                editionsList,
            )
            expect(defaultLocalState).toBeCalledTimes(1)
            expect(defaultLocalState).toBeCalledWith(defaultRegionalEditions[1])
            expect(selectedLocalState).toBeCalledTimes(1)
            expect(selectedLocalState).toBeCalledWith(
                defaultRegionalEditions[1],
            )
            const selectedEdition = await selectedEditionCache.get()
            expect(selectedEdition).toEqual(defaultRegionalEditions[1])
            const defaultEdition = await defaultEditionCache.get()
            expect(defaultEdition).toEqual(defaultRegionalEditions[1])
        })
        it('should set a default based on locale if the feature flag is on and nothing in the default edition cache', async () => {
            // defaultRegionalEditions[1] = AU and locale mock = AU
            const defaultLocalState = jest.fn()
            const selectedLocalState = jest.fn()
            const editionsList = {
                regionalEditions: defaultRegionalEditions,
                specialEditions: [],
            }

            await defaultEditionDecider(
                defaultLocalState,
                selectedLocalState,
                editionsList,
            )
            expect(defaultLocalState).toBeCalledTimes(1)
            expect(defaultLocalState).toBeCalledWith(defaultRegionalEditions[1])
            expect(selectedLocalState).toBeCalledTimes(1)
            expect(selectedLocalState).toBeCalledWith(
                defaultRegionalEditions[1],
            )
            const selectedEdition = await selectedEditionCache.get()
            expect(selectedEdition).toEqual(defaultRegionalEditions[1])
            const defaultEdition = await defaultEditionCache.get()
            expect(defaultEdition).toEqual(defaultRegionalEditions[1])
        })
    })

    describe('getDefaultEdition', () => {
        beforeEach(async () => {
            await defaultEditionCache.reset()
        })
        it('should return the default edition from storage if its there', async () => {
            await defaultEditionCache.set(defaultRegionalEditions[1])

            const defaultEdition = await getDefaultEdition()
            expect(defaultEdition).toEqual(defaultRegionalEditions[1])
        })
        it('should return null if default edition is not in storage', async () => {
            const defaultEdition = await getDefaultEdition()
            expect(defaultEdition).toEqual(null)
        })
    })
})
