import React, {
    createContext,
    useContext,
    useEffect,
    useState,
    Dispatch,
} from 'react'
import { RegionalEdition, SpecialEdition } from 'src/common'
import { eventEmitter } from 'src/helpers/event-emitter'
import { defaultSettings } from 'src/helpers/settings/defaults'
import {
    defaultEditionCache,
    selectedEditionCache,
    editionsListCache,
} from 'src/helpers/storage'
import { errorService } from 'src/services/errors'
import { defaultRegionalEditions } from '../../../Apps/common/src/editions-defaults'
import NetInfo from '@react-native-community/netinfo'
import { AppState, AppStateStatus } from 'react-native'
import { remoteConfigService } from 'src/services/remote-config'
import { locale } from 'src/helpers/locale'

interface EditionsEndpoint {
    regionalEditions: RegionalEdition[]
    specialEditions: SpecialEdition[]
}

interface EditionState {
    editionsList: EditionsEndpoint
    selectedEdition: RegionalEdition | SpecialEdition
    defaultEdition: RegionalEdition
    storeSelectedEdition: (
        chosenEdition: RegionalEdition | SpecialEdition,
        type: 'RegionalEdition' | 'SpecialEdition' | 'TrainingEdition',
    ) => void
}

export interface StoreSelectedEditionFunc {
    (
        chosenEdition: RegionalEdition | SpecialEdition,
        type: 'RegionalEdition' | 'SpecialEdition' | 'TrainingEdition',
    ): void
}

export const DEFAULT_EDITIONS_LIST = {
    regionalEditions: defaultRegionalEditions,
    specialEditions: [],
}

export const BASE_EDITION = defaultRegionalEditions[0]

const localeToEdition = new Map<string, RegionalEdition>()
localeToEdition.set('en_AU', defaultRegionalEditions[1])
localeToEdition.set('en_US', defaultRegionalEditions[2])
localeToEdition.set('en_GB', defaultRegionalEditions[0])

const defaultState: EditionState = {
    editionsList: DEFAULT_EDITIONS_LIST,
    selectedEdition: BASE_EDITION, // the current chosen edition
    defaultEdition: BASE_EDITION, // the edition to show on app start
    storeSelectedEdition: () => {},
}

const EditionContext = createContext(defaultState)

export const getSelectedEditionSlug = async () => {
    const edition = await selectedEditionCache.get()
    return edition ? edition.edition : BASE_EDITION.edition
}

// Exported for testing, only use internally to maintain local and async state
export const getDefaultEdition = async () => {
    try {
        return await defaultEditionCache.get()
    } catch {
        return null
    }
}

export const fetchEditions = async () => {
    try {
        const response = await fetch(defaultSettings.editionsUrl)
        if (response.status !== 200) {
            throw new Error(
                `Bad response from Editions URL - status: ${response.status}`,
            )
        }
        return response.json()
    } catch (e) {
        e.message = `Unable to fetch ${defaultSettings.editionsUrl} : ${e.message}`
        errorService.captureException(e)
        return null
    }
}

export const getEditions = async () => {
    try {
        const { isConnected } = await NetInfo.fetch()
        // We are connected
        if (isConnected) {
            // Grab editions list from the endpoint
            const editionsList = await fetchEditions()
            if (editionsList) {
                // Successful? Store in the cache and return
                await editionsListCache.set(editionsList)
                return editionsList
            }
            // Unsuccessful, try getting it from our local storage
            const cachedEditionsList = await editionsListCache.get()
            if (cachedEditionsList) {
                return cachedEditionsList
            }
            // Not in local storage either?
            throw new Error('Unable to Get Editions')
        }
        // Not connected? Try local storage
        const cachedEditionsList = await editionsListCache.get()
        if (cachedEditionsList) {
            return cachedEditionsList
        }
        // Not in local storage either?
        throw new Error('Unable to Get Editions')
    } catch (e) {
        errorService.captureException(e)
        return DEFAULT_EDITIONS_LIST
    }
}

const setEdition = async (
    edition: RegionalEdition,
    setDefaultEdition: Dispatch<RegionalEdition>,
    setSelectedEdition: Dispatch<RegionalEdition | SpecialEdition>,
) => {
    setDefaultEdition(edition)
    setSelectedEdition(edition)
    await selectedEditionCache.set(edition)
    await defaultEditionCache.set(edition)
}

export const defaultEditionDecider = async (
    setDefaultEdition: Dispatch<RegionalEdition>,
    setSelectedEdition: Dispatch<RegionalEdition | SpecialEdition>,
): Promise<void> => {
    const dE = await getDefaultEdition()
    if (dE) {
        setDefaultEdition(dE)
        setSelectedEdition(dE)
        await selectedEditionCache.set(dE)
    } else {
        const defaultLocaleEnabled = remoteConfigService.getBoolean(
            'default_locale',
        )
        // Feature flag on?
        if (defaultLocaleEnabled) {
            // Get the correct edition for the locale
            const dE = localeToEdition.get(locale)
            // Here as it "can" be undefined, but previous branch says not
            if (dE) {
                await setEdition(dE, setDefaultEdition, setSelectedEdition)
            } else {
                await setEdition(
                    BASE_EDITION,
                    setDefaultEdition,
                    setSelectedEdition,
                )
            }
        } else {
            // FF is off, so set to the default
            await setEdition(
                BASE_EDITION,
                setDefaultEdition,
                setSelectedEdition,
            )
        }
    }
}

export const EditionProvider = ({
    children,
}: {
    children: React.ReactNode
}) => {
    const [editionsList, setEditionsList] = useState<EditionsEndpoint>({
        regionalEditions: defaultRegionalEditions,
        specialEditions: [],
    })
    const [selectedEdition, setSelectedEdition] = useState<
        RegionalEdition | SpecialEdition
    >(BASE_EDITION)
    const [defaultEdition, setDefaultEdition] = useState<RegionalEdition>(
        BASE_EDITION,
    )

    /**
     * Default Edition and Selected
     *
     * On clean install the cache will be empty, therefore defaultRegionalEditions[0]
     * (aka The Daily) remains as the default until one is set. If found, we want to
     * also set this as the selected edition
     */
    useEffect(() => {
        defaultEditionDecider(setDefaultEdition, setSelectedEdition)
    }, [])

    /**
     * List of Editions
     *
     * We grab the editions from the endpoint. If its not accessible, we use the default
     * editions that are set in the initial state
     */
    useEffect(() => {
        getEditions().then(ed => ed && setEditionsList(ed))
    }, [])

    /**
     * If a chosen edition is regional, then we mark that as default for future reference
     */
    const storeSelectedEdition: StoreSelectedEditionFunc = async (
        chosenEdition,
        type,
    ) => {
        await selectedEditionCache.set(chosenEdition)
        setSelectedEdition(chosenEdition)
        if (type === 'RegionalEdition') {
            await defaultEditionCache.set(chosenEdition as RegionalEdition)
            setDefaultEdition(chosenEdition as RegionalEdition)
        }
        eventEmitter.emit('editionUpdate')
    }

    /**
     * On App State change to foreground, we want to check for a new editionsList
     */
    useEffect(() => {
        const appChangeEventHandler = async (appState: AppStateStatus) =>
            appState === 'active' &&
            getEditions().then(ed => ed && setEditionsList(ed))

        AppState.addEventListener('change', appChangeEventHandler)

        return () => {
            AppState.removeEventListener('change', appChangeEventHandler)
        }
    })

    return (
        <EditionContext.Provider
            value={{
                editionsList,
                selectedEdition,
                defaultEdition,
                storeSelectedEdition,
            }}
        >
            {children}
        </EditionContext.Provider>
    )
}

export const useEditions = () => useContext(EditionContext)
