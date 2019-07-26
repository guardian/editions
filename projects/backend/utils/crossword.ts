import { capitalizeFirstLetter, addCommas } from './format'
import { ICrossword } from '@guardian/capi-ts/dist/Crossword'

const crosswordTypes = ['quick', 'cryptic', 'speedy', 'everyman'] as const

type CrosswordType = typeof crosswordTypes[number] | null

const getCrosswordType = (path: string): CrosswordType => {
    for (const key of crosswordTypes) {
        if (path.includes(key)) return key
    }
    return null
}

const getCrosswordName = (type: CrosswordType): string =>
    type ? capitalizeFirstLetter(type) + ' crossword' : 'Crossword'

const getCrosswordKicker = (crossword: ICrossword) =>
    addCommas(crossword.number)

export { CrosswordType, getCrosswordType, getCrosswordName, getCrosswordKicker }
