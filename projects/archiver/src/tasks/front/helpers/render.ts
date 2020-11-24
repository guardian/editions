import { unnest } from 'ramda'
import { Front } from '../../../../common'
import { getRenderedContent } from '../../../utils/backend-client'
import { getBucket, ONE_MONTH, upload } from '../../../utils/s3'

// call render function in backend client, store result

export const uploadRenderedArticle = async (path: string, html: string) => {
    const Bucket = getBucket('proof')
    return upload(path, html, Bucket, 'text/html', ONE_MONTH)
}

/**
 * Loop through all the articles of Front object and fetch
 * server-side-redering (SSR) article content for each article
 * @param front
 */
export const getSSRArticlesFromFront = async (front: Front) => {
    console.log('Getting images for front ' + JSON.stringify(front))

    const allCards = unnest(front.collections.map(_ => _.cards))
    const content = unnest(allCards.map(_ => Object.values(_.articles)))
    const renderedContent = await Promise.all(
        content.map(async c => {
            return {
                internalPageCode: c.internalPageCode,
                content: await getRenderedContent(c.key),
            }
        }),
    )

    return renderedContent
}
