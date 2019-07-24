import { TagType } from '@guardian/capi-ts'
import { IContent } from '@guardian/capi-ts/dist/Content'
import { ITag } from '@guardian/capi-ts/dist/Tag'

const tagTitleIsAlreadyInHeadline = (tag: ITag, headline: string) =>
    headline.toLowerCase().includes(tag.webTitle.toLowerCase())

/*
 - Use series tag if we have one
 - Use tone for {"Letters", "Analysis", "Obituaries"}
 - Use tone without the last character for {"Reviews", "Editorials", "Match Reports", "Explainers"}
 - Use byline for "Comment" tone
 - Use top tag if both top and second tag feature in the headline
 - Use second tag if top tag features in the headline
 - Otherwise use top tag
 */
const kickerPicker = (article: IContent, headline: string) => {
    const byline = article.fields && article.fields.byline
    const seriesTag = article.tags.find(tag => tag.type === TagType.SERIES)
    const toneTag = article.tags.find(tag => tag.type === TagType.TONE)

    if (seriesTag) return seriesTag.webTitle

    if (toneTag && toneTag.id) {
        if (
            toneTag.id === 'tone/letters' ||
            toneTag.id === 'tone/analysis' ||
            toneTag.id === 'tone/obituaries'
        )
            return toneTag.webTitle

        if (
            toneTag.id === 'tone/reviews' ||
            toneTag.id === 'tone/editorials' ||
            toneTag.id === 'tone/matchreports' ||
            toneTag.id === 'tone/explainers'
        )
            return toneTag.webTitle.slice(0, -1)

        if (toneTag.id === 'tone/comment') return byline
    }

    const topTag: ITag | undefined = article.tags[0]
    const secondTag: ITag | undefined = article.tags[1]

    if (!topTag) return

    if (
        !tagTitleIsAlreadyInHeadline(topTag, headline) ||
        !secondTag ||
        tagTitleIsAlreadyInHeadline(secondTag, headline)
    )
        return topTag.webTitle

    return secondTag.webTitle
}

export { kickerPicker }
