import { Edition, hasFailed, EditionInterface } from '../../common'
import { getEditions } from '../utils/backend-client'

export const getEditionDisplayName = async (editionId: Edition) => {
    const maybeEditionsList = await getEditions()

    if (hasFailed(maybeEditionsList)) {
        console.error("Failed to fetch editions list, can't find display name")
        throw new Error(`Could not fetch editions list`)
    }

    const allEditions: EditionInterface[] = maybeEditionsList.regionalEditions
        .concat(maybeEditionsList.specialEditions)
        .concat(maybeEditionsList.trainingEditions)

    const edition = allEditions.find(e => e.edition === editionId)

    if (!edition) {
        throw new Error(
            `${edition} missing in editionToName mapping. Editions List: ${allEditions}`,
        )
    }

    return edition.title
}
