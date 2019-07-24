import { Image } from '../../../common'

export interface ArticleHeaderProps {
    byline: string
    headline: string | React.Component
    kicker?: string | null
    image?: Image | null
    standfirst: string
}
