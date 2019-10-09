const createEditionToNameMap = () => {
    const map = new Map()
    map.set('daily-edition', 'Daily Edition')
    map.set('american-edition', 'American Edition')
    map.set('australian-edition', 'Australian Edition')
    map.set('training-edition', 'Training Edition')
    return map
}

const createEditionToCuntryMap = () => {
    const map = new Map()
    map.set('daily-edition', 'uk')
    map.set('american-edition', 'usa')
    map.set('australian-edition', 'au')
    map.set('training-edition', 'uk')
    return map
}

const editionToName = createEditionToNameMap()

const editionToCuntry = createEditionToCuntryMap()

export const getEditionNameBy = (edition: string) => {
    if (!editionToName.has(edition)) {
        throw new Error(`${edition} missing in editionToName mapping`)
    }
    return editionToName.get(edition)
}

export const getEditionCountryBy = (edition: string) => {
    if (!editionToCuntry.has(edition)) {
        throw new Error(`${edition} missing in editionToCuntry mapping`)
    }
    return editionToCuntry.get(edition)
}
