// If above failts to fetch from asyncStorage to intially publish it
// If nothing exists use daily-edition

// Combine the two as mentioned above
// Save edition endpoint to file storage
// Access file storage in the event that there is no wifi(?) signal

// Seperate is to update the edition usage througout the app to use these functions.

import React, { createContext, useContext, useEffect, useState } from 'react'
import { RegionalEdition, SpecialEdition } from 'src/common'
import { eventEmitter } from 'src/helpers/event-emitter'
import { defaultSettings } from 'src/helpers/settings/defaults'
import { defaultEditionCache, selectedEditionCache } from 'src/helpers/storage'
import { errorService } from 'src/services/errors'
import { defaultRegionalEditions } from '../../../Apps/common/src/editions-defaults'

interface EditionsEndpoint {
    regionalEditions: RegionalEdition[]
    specialEditions: SpecialEdition[]
}

interface EditionState {
    editions: EditionsEndpoint
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
        type: 'RegionalEdition' | 'SpecialEdition',
    ): void
}

const defaultState: EditionState = {
    editions: {
        regionalEditions: defaultRegionalEditions,
        specialEditions: [],
    }, // list of all editions
    selectedEdition: defaultRegionalEditions[0], // the current chosen edition
    defaultEdition: defaultRegionalEditions[0], // the edition to show on app start
    storeSelectedEdition: () => {},
}

const BASE_EDITION = defaultRegionalEditions[0]

const EditionContext = createContext(defaultState)

export const getSelectedEditionSlug = async () => {
    try {
        const edition = await selectedEditionCache.get()
        return edition ? edition.edition : BASE_EDITION.edition
    } catch {
        // This needs a better tactic inorder to match the default???
        return BASE_EDITION.edition
    }
}

// Need to consider remote config here and how this will work...
export const getDefaultEdition = async () => await defaultEditionCache.get()

const fetchEditions = async () => {
    // Need to check network state and then read from file storage

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

// Function required to store endpoint to file storage

export const EditionProvider = ({
    children,
}: {
    children: React.ReactNode
}) => {
    const [editions, setEditions] = useState<EditionsEndpoint>({
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
        getDefaultEdition().then(dE => {
            if (dE) {
                setDefaultEdition(dE)
                setSelectedEdition(dE)
                selectedEditionCache.set(dE)
            }
        })
    }, [])

    /**
     * List of Editions
     *
     * We grab the editions from the endpoint. If its not accessible, we use the default
     * editions that are set in the initial state
     */
    useEffect(() => {
        fetchEditions().then(ed => ed && setEditions(ed))
    }, [])

    /**
     * If a chosen edition is regional, then we mark that as default for future reference
     */
    const storeSelectedEdition: StoreSelectedEditionFunc = async (
        chosenEdition,
        type,
    ) => {
        // What happens if async storage setting fails??
        await selectedEditionCache.set(chosenEdition)
        setSelectedEdition(chosenEdition)
        if (type === 'RegionalEdition') {
            await defaultEditionCache.set(chosenEdition as RegionalEdition)
            setDefaultEdition(chosenEdition as RegionalEdition)
        }
        eventEmitter.emit('editionUpdate')
    }

    return (
        <EditionContext.Provider
            value={{
                editions,
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
