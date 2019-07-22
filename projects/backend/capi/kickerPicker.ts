import { TagType } from '@guardian/capi-ts'
import { IContent } from '@guardian/capi-ts/dist/Content'
import { ITag } from '@guardian/capi-ts/dist/Tag'

/*
 - Use series tag if we have one
 - Use tone for {"Letters", "Analysis", "Obituaries"}
 - Use tone without the last character for {"Reviews", "Editorials", "Match Reports", "Explainers"}
 - Use byline for "Comment" tone
 - Use top tag if both top and second tag feature in the headline
 - Use second tag if top tag features in the headline
 - Otherwise use top tag
 */
const kickerPicker = (
    article: IContent,
    headline: string,
    byline: string | undefined,
) => {
    let seriesTag: ITag | undefined = article.tags.filter(
        tag => tag.type == TagType.SERIES,
    )[0]

    let toneTag: ITag | undefined = article.tags.filter(
        tag => tag.type == TagType.TONE,
    )[0]

    let topTag: ITag | undefined = article.tags[0]
    let secondTag: ITag | undefined = article.tags[1]

    if (seriesTag) return seriesTag.webTitle

    if (
        (toneTag && toneTag.id && toneTag.id == 'tone/letters') ||
        toneTag.id == 'tone/analysis' ||
        toneTag.id == 'tone/obituaries'
    )
        return toneTag.webTitle

    if (
        (toneTag && toneTag.id && toneTag.id == 'tone/reviews') ||
        toneTag.id == 'tone/editorials' ||
        toneTag.id == 'tone/matchreports' ||
        toneTag.id == 'tone/explainers'
    )
        return toneTag.webTitle.substring(0, toneTag.webTitle.length - 1)

    if (toneTag && toneTag.id && toneTag.id == 'tone/comment') return byline

    if (
        topTag &&
        headline.toLowerCase().includes(topTag.webTitle.toLowerCase()) &&
        secondTag &&
        headline.toLowerCase().includes(secondTag.webTitle.toLowerCase())
    )
        return topTag.webTitle

    if (
        topTag &&
        headline.toLowerCase().includes(topTag.webTitle.toLowerCase())
    )
        return secondTag && secondTag.webTitle

    return topTag && topTag.webTitle
}

export { kickerPicker }
