import { Image as ImageT } from 'src/common'
import {
    Article,
    CreditedImage,
    MediaAtomElement
} from '../../../../../../Apps/common/src'

export interface ArticleHeaderProps {
    headline: string
    byline?: string
    kicker?: string | null
    image?: CreditedImage | null
    standfirst?: string
    starRating?: Article['starRating']
    sportScore?: Article['sportScore']
    bylineImages?: { cutout?: ImageT }
    bylineHtml?: string
    mainMedia?: MediaAtomElement
}

