import React from 'react'
import { BorderedKicker } from '../BorderedKicker'
import { Byline } from '../Byline'
import { Headline } from '../Headline'
import { LineContainer } from '../LineContainer'
import { Multiline } from '../Multiline'
import { Standfirst } from '../Standfirst'
import { TrailImage } from '../TrailImage'
import { Article } from '../../model/Article'

const ArticleHeader = ({ article }: { article: Article }) => (
    <LineContainer>
        <TrailImage {...article.trailImage} />
        <BorderedKicker>{article.kicker}</BorderedKicker>
        <Headline>{article.headline}</Headline>
        <Standfirst>{article.standfirst}</Standfirst>
        <Multiline color="#999" />
        <Byline>{article.byline}</Byline>
        <Multiline color="#dcdcdc" count={1} />
    </LineContainer>
)

export { ArticleHeader }
