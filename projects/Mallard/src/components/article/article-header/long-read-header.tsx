import React from 'react'
import { View, StyleSheet } from 'react-native'
import { HeadlineText } from 'src/components/styled-text'
import { useArticleAppearance } from 'src/theme/appearance'
import { getNavigationPosition } from 'src/helpers/positions'
import { ArticleImage } from '../article-image'
import { longReadHeaderStyles } from '../styles'
import { ArticleKicker } from '../article-kicker'
import { ArticleStandfirst } from '../article-standfirst'
import { ArticleHeaderProps } from './types'
import { Multiline } from '../../multiline'
import { ArticleByline } from '../article-byline'
import { ArticleHeadline } from '../article-headline'

const LongReadHeader = ({
    byline,
    headline,
    image,
    kicker,
    standfirst,
}: ArticleHeaderProps) => {
    const { appearance } = useArticleAppearance()
    const navigationPosition = getNavigationPosition('article')
    return (
        <View style={[longReadHeaderStyles.background, appearance.backgrounds]}>
            {image ? (
                <ArticleImage
                    style={StyleSheet.absoluteFillObject}
                    image={image}
                />
            ) : null}
            <View
                style={[
                    longReadHeaderStyles.textBackground,
                    appearance.backgrounds,
                ]}
            >
                {kicker ? (
                    <ArticleKicker kicker={kicker} type="longRead" />
                ) : null}
                <ArticleHeadline type="longRead">{headline}</ArticleHeadline>
            </View>
            <ArticleStandfirst
                {...{ byline, standfirst, navigationPosition }}
            />
            <Multiline count={4} />
            <ArticleByline>{byline}</ArticleByline>
        </View>
    )
}

export { LongReadHeader }
