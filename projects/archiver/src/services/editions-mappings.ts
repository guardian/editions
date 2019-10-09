const createEditionToNameMap = () => {
    const map = new Map<string, string>()
    map.set('daily-edition', 'Daily Edition')
    map.set('american-edition', 'American Edition')
    map.set('australian-edition', 'Australian Edition')
    map.set('training-edition', 'Training Edition')
    return map
}

const editionToName = createEditionToNameMap()

export const getEditionNameBy = (edition: string): string => {
    if (!editionToName.has(edition)) {
        throw new Error(`${edition} missing in editionToName mapping`)
    }
    // it will never be empty string because of above check, || '' is made to make compiler happy
    return editionToName.get(edition) || ''
}
