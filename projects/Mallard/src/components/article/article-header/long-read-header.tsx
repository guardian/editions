import React from 'react'
import { View, StyleSheet } from 'react-native'
import { HeadlineText } from 'src/components/styled-text'
import { useArticleAppearance } from 'src/theme/appearance'
import { ArticleImage } from '../article-image'
import { longReadHeaderStyles } from './styles'
import { ArticleKicker } from '../article-kicker/article-kicker'
import { ArticleHeaderProps } from './types'

const LongReadHeader = ({ headline, image, kicker }: ArticleHeaderProps) => {
    const { appearance } = useArticleAppearance()
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
                <HeadlineText
                    style={[
                        longReadHeaderStyles.headline,
                        appearance.text,
                        appearance.headline,
                    ]}
                >
                    {headline}
                </HeadlineText>
            </View>
        </View>
    )
}

export { LongReadHeader }
