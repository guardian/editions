import { Image, Article } from '../../../common'
import { CreditedImage } from '../../../../../common/src'

export interface ArticleHeaderProps {
    headline: string
    byline?: string
    kicker?: string | null
    image?: CreditedImage | null
    standfirst?: string
    starRating?: Article['starRating']
    bylineImages?: { cutout?: Image }
    bylineHtml?: string
}
