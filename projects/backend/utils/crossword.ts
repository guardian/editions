import { capitalizeFirstLetter, addCommas } from './format'
import { CCrossword } from '../capi/articles'
import {
    CAPIArticle,
    Crossword,
    CrosswordArticle,
    CrosswordType,
    TrailImage,
} from '../common'
import { getImageFromURL } from '../image'
import { omit } from 'ramda'

const enumKeyToKebabCase = (key: string) => key.toLowerCase().replace(/_/g, '-')

const getCrosswordType = (path: string): CrosswordType => {
    for (const [key, type] of Object.entries(CrosswordType)) {
        if (path.includes(enumKeyToKebabCase(key))) return type
    }
    return CrosswordType.QUICK // default to something sensible as this is largely used for rendering
}

const getCrosswordName = (type: CrosswordType): string =>
    type ? capitalizeFirstLetter(type) + ' crossword' : 'Crossword'

const getCrosswordKicker = (crossword: Crossword) => addCommas(crossword.number)

//TODO: get images according to type

const getCrosswordImageFromURL = (url: string): TrailImage | undefined => {
    const image = getImageFromURL(url)
    return (
        image && {
            ...image,
            use: {
                mobile: 'full-size',
                tablet: 'full-size',
            },
        }
    )
}

const getCrosswordImage = (type: CrosswordType): TrailImage | undefined => {
    if (type === 'cryptic') {
        return getCrosswordImageFromURL(
            'https://media.guim.co.uk/70609fd8e274ee8b2cbb19f7537c9a4f3bd6328a/0_0_2048_2048/1000.jpg',
        )
    }
    return getCrosswordImageFromURL(
        'https://media.guim.co.uk/ddcfc3a9c1963f8769d02c27db1cea6312057f81/0_0_2048_2048/1000.jpg',
    )
}

type CrosswordArticleOverrides = Pick<
    CAPIArticle,
    'headline' | 'kicker' | 'trailImage'
> &
    Pick<CrosswordArticle, 'crossword'>

const removeSolutionsFromEntries = (entries: Crossword['entries']) =>
    entries.map(omit(['solution']))

export const patchCrossword = (
    crossword: Crossword,
    type: CrosswordType,
): Crossword => {
    // for crosswords with a dateSolutionAvailable in the future, hide solutions
    // this will be permanent even after the date has passed unless the edition is republished
    // editions might be pressed before a crosssord is due to be published so + 1 day
    const oneDay = 24 * 60 * 60 * 1000
    const thisTimeTomorrow = new Date().getTime() + oneDay
    const solutionAvailable =
        !crossword.dateSolutionAvailable ||
        crossword.dateSolutionAvailable.dateTime < thisTimeTomorrow

    return {
        ...crossword,
        // the original type was a number from the CAPI thrift definition here
        type,
        solutionAvailable,
        entries: solutionAvailable
            ? crossword.entries
            : removeSolutionsFromEntries(crossword.entries),
    }
}

export const getCrosswordArticleOverrides = (
    article: CCrossword,
): CrosswordArticleOverrides => {
    const type = getCrosswordType(article.path)
    return {
        headline: getCrosswordName(type),
        kicker: getCrosswordKicker(article.crossword),
        trailImage: getCrosswordImage(type),
        crossword: patchCrossword(article.crossword, type),
    }
}
