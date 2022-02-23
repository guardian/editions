import { TagType } from '@guardian/content-api-models/v1/tagType'
import { Content } from '@guardian/content-api-models/v1/content'
import { Tag } from '@guardian/content-api-models/v1/tag'

const tagTitleIsAlreadyInHeadline = (tag: Tag, headline: string) =>
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
const kickerPicker = (article: Content, headline: string) => {
    const byline = article.fields && article.fields.byline
    const seriesTag = article.tags.find((tag) => tag.type === TagType.SERIES)
    const toneTag = article.tags.find((tag) => tag.type === TagType.TONE)

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

    const topTag: Tag | undefined = article.tags[0]
    const secondTag: Tag | undefined = article.tags[1]

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
