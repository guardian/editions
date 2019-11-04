import React from 'react'
import { StyleSheet } from 'react-native'
import { ItemTappable, PropTypes } from './helpers/item-tappable'
import { TextBlock } from './helpers/text-block'
import { SuperHeroImageItem } from './super-items'
import { Stars } from 'src/components/stars/stars'
import { SportScore } from 'src/components/sportscore/sportscore'
import { View } from 'react-native'
import { CAPIArticle } from 'src/common'

const styles = StyleSheet.create({
    starsAndSportScoreWrapper: {
        flexDirection: 'row',
        marginBottom: 4,
    },
    starsAndSportScore: {
        flex: 0,
    },
})

const StarsWrapper = ({ article }: { article: CAPIArticle }) => {
    if (article.type != 'article' || article.starRating == null) return null
    return (
        <View style={styles.starsAndSportScoreWrapper}>
            <Stars
                style={styles.starsAndSportScore}
                rating={article.starRating}
            />
        </View>
    )
}

const SportsWrapper = ({ article }: { article: CAPIArticle }) => {
    if (article.type != 'article' || article.sportScore == null) return null
    return (
        <View style={styles.starsAndSportScoreWrapper}>
            <SportScore
                style={styles.starsAndSportScore}
                sportScore={article.sportScore}
            />
        </View>
    )
}

const SmallItem = ({ article, size, ...tappableProps }: PropTypes) => {
    return (
        <ItemTappable {...tappableProps} {...{ article }}>
            <StarsWrapper article={article} />
            <SportsWrapper article={article} />
            <TextBlock
                byline={article.byline}
                type={article.type}
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
                type={article.type}
                kicker={article.kicker}
                headline={article.headline}
                fontSize={1.25}
            />
        </ItemTappable>
    )
}

export { SuperHeroImageItem, SmallItem, SmallItemLargeText }
