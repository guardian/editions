import { Image, Article } from '../../../common'
import { CreditedImage } from '../../../../../common/src'

export interface ArticleHeaderProps {
    byline: string
    headline: string
    kicker?: string | null
    image?: CreditedImage | null
    standfirst: string
    starRating?: Article['starRating']
    bylineImages?: { cutout?: Image }
    bylineHtml: string
}
