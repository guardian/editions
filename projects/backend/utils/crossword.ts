import { capitalizeFirstLetter, addCommas } from './format'
import { CCrossword } from '../capi/articles'
import {
    CAPIArticle,
    Crossword,
    CrosswordArticle,
    CrosswordType,
} from '../common'
import { getImageFromURL } from '../image'

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
const getCrosswordImage = (type: CrosswordType) => {
    if (type === 'cryptic') {
        return getImageFromURL(
            'https://media.guim.co.uk/70609fd8e274ee8b2cbb19f7537c9a4f3bd6328a/0_0_2048_2048/1000.jpg',
        )
    }
    return getImageFromURL(
        'https://media.guim.co.uk/ddcfc3a9c1963f8769d02c27db1cea6312057f81/0_0_2048_2048/1000.jpg',
    )
}

type CrosswordArticleOverrides = Pick<
    CAPIArticle,
    'headline' | 'kicker' | 'trailImage'
> &
    Pick<CrosswordArticle, 'crossword'>

export const getCrosswordArticleOverrides = (
    article: CCrossword,
): CrosswordArticleOverrides => {
    const type = getCrosswordType(article.path)
    return {
        headline: getCrosswordName(type),
        kicker: getCrosswordKicker(article.crossword),
        trailImage: getCrosswordImage(type),
        crossword: {
            ...article.crossword,
            type,
        },
    }
}
