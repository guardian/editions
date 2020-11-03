import { unnest } from 'ramda'
import {
    CAPIArticle,
    ImageSize,
    imageSizes,
    RenderedContent,
} from '../../../../../Apps/common/src'
import { Attempt, hasFailed } from '../../../../../backend/utils/try'
import { Front, TrailImage, Image } from '../../../../common'
import { getRenderedContent } from '../../../utils/backend-client'
import { getBucket, ONE_MONTH, upload } from '../../../utils/s3'

// call render function in backend client, store result

export const uploadRenderedArticle = async (
    internalPageCode: number,
    html: RenderedContent[],
) => {
    const Bucket = getBucket('proof')
    return await Promise.all(
        html.map(html => {
            const path = `html/${html.size}/${internalPageCode}.html`
            return upload(path, html.html, Bucket, 'text/html', ONE_MONTH)
        }),
    )
}

export const getHtmlFromFront = async (front: Front) => {
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
