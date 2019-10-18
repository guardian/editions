import React from 'react'
import { ItemTappable, PropTypes } from './helpers/item-tappable'
import { TextBlock } from './helpers/text-block'
import { SuperHeroImageItem } from './super-items'
import { Stars } from 'src/components/stars/stars'
import { View } from 'react-native'

const SmallItem = ({ article, size, ...tappableProps }: PropTypes) => {
    return (
        <ItemTappable {...tappableProps} {...{ article }}>
            <View style={{ flexDirection: 'row', marginBottom: 4 }}>
                {article.starRating && (
                    <Stars style={{ flex: 0 }} rating={article.starRating} />
                )}
            </View>
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
