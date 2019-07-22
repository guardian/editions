import React from 'react'
import { View, Animated } from 'react-native'
import { HeadlineText } from 'src/components/styled-text'
import { metrics } from 'src/theme/spacing'
import { useArticleAppearance } from 'src/theme/appearance'
import { ArticleImage } from '../article-image'
import { getNavigationPosition } from 'src/helpers/positions'
import { newsHeaderStyles } from './styles'
import { ArticleKicker } from '../article-kicker/article-kicker'
import { ArticleHeaderProps } from './types'

const NewsHeader = ({ headline, image, kicker }: ArticleHeaderProps) => {
    const { appearance } = useArticleAppearance()
    const navigationPosition = getNavigationPosition('article')
    return (
        <View style={[newsHeaderStyles.background, appearance.backgrounds]}>
            {image ? (
                <ArticleImage
                    style={{
                        aspectRatio: 1.5,
                        marginBottom: metrics.vertical / 4,
                    }}
                    image={image}
                />
            ) : null}
            {kicker ? <ArticleKicker kicker={kicker} /> : null}
            <Animated.View
                style={[
                    navigationPosition && {
                        opacity: navigationPosition.position.interpolate({
                            inputRange: [0.4, 1],
                            outputRange: [0, 1],
                        }),
                    },
                ]}
            >
                <HeadlineText
                    style={[
                        newsHeaderStyles.headline,
                        appearance.text,
                        appearance.headline,
                    ]}
                >
                    {headline}
                </HeadlineText>
            </Animated.View>
        </View>
    )
}

export { NewsHeader }
