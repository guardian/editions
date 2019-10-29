import React from 'react'
import { StyleSheet, View, StyleProp } from 'react-native'
import { Stars } from 'src/components/stars/stars'
import { CAPIArticle } from 'src/common'
import { ImageResource } from '../image-resource'
import { SportScore } from 'src/components/sportscore/sportscore'
import { ArticleType } from '../../../../../common/src'

const trailImageViewStyles = StyleSheet.create({
    frame: {
        width: '100%',
        flex: 0,
    },
    image: {
        width: '100%',
        height: '100%',
    },
    rating: {
        position: 'absolute',
        backgroundColor: 'white',
        left: 0,
        bottom: 0,
    },
})

/**
 * If there is a rating for the article (ex. a theater piece rating) then we
 * display it in the bottom-left corner of the image (by using absolute
 * positioning).
 */
export const TrailImageView = ({
    article,
    style,
}: {
    article: CAPIArticle
    style: StyleProp<{ width?: string; height?: string; marginLeft?: number }>
}) => {
    const { trailImage: image } = article
    if (image == null) {
        return null
    }
    const frameStyle = [trailImageViewStyles.frame, style]
    const starRating = article.type === 'article' && article.starRating
    const sportScore =
        article.articleType === ArticleType.MatchResult && article.sportScore

    if (starRating) {
        return (
            <View style={frameStyle}>
                <ImageResource
                    style={trailImageViewStyles.image}
                    image={image}
                />
                <Stars
                    style={trailImageViewStyles.rating}
                    rating={starRating}
                />
            </View>
        )
    } else if (sportScore) {
        return (
            <View style={frameStyle}>
                <ImageResource
                    style={trailImageViewStyles.image}
                    image={image}
                />
                <SportScore
                    style={trailImageViewStyles.rating}
                    sportScore={sportScore}
                />
            </View>
        )
    } else {
        return <ImageResource style={frameStyle} image={image} />
    }
}
