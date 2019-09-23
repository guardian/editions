import { IContent, TagType } from '@guardian/capi-ts'
import { getImageFromURL } from '../image'
import { Image } from '../common'

export const getBylineImages = (
    article: IContent,
): { cutout?: Image } | undefined => {
    const byline = article.fields && article.fields.byline
    if (byline == null) return undefined
    // We could be more clever here, but multiple contributer tags wouldn't be displayed.
    const tags = article.tags

    const contributor = tags.find(
        tag =>
            tag.type == TagType.CONTRIBUTOR &&
            byline.includes(tag.webTitle) &&
            tag.bylineLargeImageUrl,
    )
    if (contributor == null) return
    const { bylineLargeImageUrl } = contributor
    const cutout =
        bylineLargeImageUrl !== undefined
            ? getImageFromURL(bylineLargeImageUrl)
            : undefined
    return { cutout }
}
