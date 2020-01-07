import { Edition } from '../../common'

const createEditionToDisplayNameMap = () => {
    const map = new Map<Edition, string>()
    map.set('daily-edition', 'Daily Edition')
    map.set('american-edition', 'American Edition')
    map.set('australian-edition', 'Australian Edition')
    map.set('training-edition', 'Training Edition')
    map.set('the-dummy-edition', 'The Dummy Edition')
    return map
}

const editionToName = createEditionToDisplayNameMap()

export const getEditionDisplayName = (edition: Edition): string => {
    if (!editionToName.has(edition)) {
        throw new Error(`${edition} missing in editionToName mapping`)
    }
    // it will never be empty string because of above check, || '' is made to make compiler happy
    return editionToName.get(edition) || ''
}
