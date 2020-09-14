import { Edition, hasFailed, EditionInterface } from '../../common'
import { getEditions } from '../utils/backend-client'

const getTitle = (list: EditionInterface[], editionId: string) => {
    const match = list.find(l => l.edition === editionId)
    return match && match.title
}

export const getEditionDisplayName = async (editionId: Edition) => {
    const maybeEditionsList = await getEditions()

    if (hasFailed(maybeEditionsList)) {
        console.error("Failed to fetch editions list, can't find display name")
        throw new Error(`Could not fetch editions list`)
    }

    const editionTitle =
        getTitle(maybeEditionsList.regionalEditions, editionId) ||
        getTitle(maybeEditionsList.specialEditions, editionId)

    if (!editionTitle) {
        throw new Error(
            `${editionId} missing in editionToName mapping. Editions List: ${maybeEditionsList}`,
        )
    }

    return editionTitle
}
