const createEditionToNameMap = () => {
    const map = new Map<string, string>()
    map.set('daily-edition', 'Daily Edition')
    map.set('american-edition', 'American Edition')
    map.set('australian-edition', 'Australian Edition')
    map.set('training-edition', 'Training Edition')
    return map
}

const createEditionToCountryMap = () => {
    const map = new Map<string, string>()
    map.set('daily-edition', 'uk')
    map.set('american-edition', 'usa')
    map.set('australian-edition', 'au')
    map.set('training-edition', 'uk')
    return map
}

const editionToName = createEditionToNameMap()

const editionToCountry = createEditionToCountryMap()

export const getEditionNameBy = (edition: string): string => {
    if (!editionToName.has(edition)) {
        throw new Error(`${edition} missing in editionToName mapping`)
    }
    // it will never be empty string because of above check, || '' is made to make compiler happy
    return editionToName.get(edition) || ''
}

export const getEditionCountryBy = (edition: string): string => {
    if (!editionToCountry.has(edition)) {
        throw new Error(`${edition} missing in editionToCountry mapping`)
    }
    // it will never be empty string because of above check, || '' is made to make compiler happy
    return editionToCountry.get(edition) || ''
}
