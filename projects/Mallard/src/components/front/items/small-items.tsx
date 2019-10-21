import React from 'react'
import { StyleSheet } from 'react-native'
import { ItemTappable, PropTypes } from './helpers/item-tappable'
import { TextBlock } from './helpers/text-block'
import { SuperHeroImageItem } from './super-items'
import { Stars } from 'src/components/stars/stars'
import { View } from 'react-native'
import { CAPIArticle } from 'src/common'

const styles = StyleSheet.create({
    starsWrapper: {
        flexDirection: 'row',
        marginBottom: 4,
    },
    stars: {
        flex: 0,
    },
})

const StarsWrapper = ({ article }: { article: CAPIArticle }) => {
    if (article.type != 'article' || article.starRating == null) return null
    return (
        <View style={styles.starsWrapper}>
            <Stars style={styles.stars} rating={article.starRating} />
        </View>
    )
}

const SmallItem = ({ article, size, ...tappableProps }: PropTypes) => {
    return (
        <ItemTappable {...tappableProps} {...{ article }}>
            <StarsWrapper article={article} />
            <TextBlock
                byline={article.byline}
                kicker={article.kicker}
                headline={article.headline}
                {...{ size }}
            />
        </ItemTappable>
    )
}

const SmallItemLargeText = ({ article, ...tappableProps }: PropTypes) => {
    return (
        <ItemTappable {...tappableProps} {...{ article }}>
            <TextBlock
                byline={article.byline}
                kicker={article.kicker}
                headline={article.headline}
                fontSize={1.25}
            />
        </ItemTappable>
    )
}

export { SuperHeroImageItem, SmallItem, SmallItemLargeText }
