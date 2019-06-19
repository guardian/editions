import React, { ReactNode, useMemo } from 'react'
import { StyleSheet, Animated, View } from 'react-native'
import { Multiline } from '../../multiline'
import { metrics } from '../../../theme/spacing'

import { useArticleAppearance } from '../../../theme/appearance'
import { PropTypes as CollectionPropTypes } from '../collection'
import { Article } from 'src/common'
import { Collection } from '../../../common'
import { Card } from './../card-group/card'

export enum Size {
    row,
    third,
    half,
    hero,
    superhero,
}

const styles = StyleSheet.create({
    row: {
        flexGrow: 1,
        flexDirection: 'column',
        alignItems: 'stretch',
        justifyContent: 'space-between',
    },
    doubleRow: {
        flex: 1,
        flexDirection: 'row',
        overflow: 'hidden',
        display: 'flex',
        justifyContent: 'center',
        alignItems: 'stretch',
    },
    card: {
        flex: 1,
    },
    rightCard: {
        borderLeftWidth: StyleSheet.hairlineWidth,
    },
})

interface NavigationPropTypes {
    collection: Collection['key']
}
interface RowPropTypes {
    translate: CollectionPropTypes['translate']
    isLastChild: boolean
    index: number
    size: Size
}

const getHeightForSize = (size: Size): string => {
    const heights = {
        [Size.row]: 'auto',
        [Size.third]: `${(2 / 6) * 100}%`,
        [Size.half]: '50%',
        [Size.hero]: `${(4 / 6) * 100}%`,
        [Size.superhero]: 'auto',
    }

    return heights[size]
}

/*
this is the low level row that actually takes in children. do not export
*/
const Row = ({
    children,
    translate,
    isLastChild,
    index,
    size,
}: {
    children: ReactNode
} & RowPropTypes) => {
    const { appearance } = useArticleAppearance()
    const height = useMemo(() => getHeightForSize(size), [size])
    return (
        <Animated.View
            style={[
                styles.row,
                { height },
                {
                    transform: [
                        {
                            translateX: translate.interpolate({
                                inputRange: [
                                    metrics.horizontal * -1.5,
                                    0,
                                    metrics.horizontal * 1.5,
                                ],
                                outputRange: [60 * index, 0, -60 * index],
                            }),
                        },
                    ],
                },
            ]}
        >
            {children}
            {isLastChild ? null : (
                <Multiline
                    color={appearance.backgrounds.borderColor}
                    count={2}
                    style={{ flex: 0 }}
                />
            )}
        </Animated.View>
    )
}

/*
ROW WITH ARTICLE
shows 1 article
*/
const RowWithArticle = ({
    article,
    collection,
    ...rowProps
}: {
    article: Article
} & NavigationPropTypes &
    RowPropTypes) => (
    <Row {...rowProps}>
        <Card
            style={styles.card}
            size={rowProps.size}
            path={{
                article: article.key,
                collection,
            }}
            article={article}
        />
    </Row>
)

/*
ROW WITH TWO ARTICLES
shows 2 articles side by side. If there's less 
it falls back to a single row and if there's more 
then it eats them up
*/
const RowWithTwoArticles = ({
    articles,
    collection,
    ...rowProps
}: {
    articles: [Article, Article]
} & NavigationPropTypes &
    RowPropTypes) => {
    const { appearance } = useArticleAppearance()

    /*
    we can't fully enforce this article pair so if 
    something goes wrong and we are missing article #2 
    we fall back to 1 article
    */
    if (!articles[1])
        return (
            <RowWithArticle
                {...rowProps}
                collection={collection}
                article={articles[0]}
            />
        )
    return (
        <Row {...rowProps}>
            <View style={styles.doubleRow}>
                <Card
                    style={[styles.card]}
                    path={{
                        article: articles[0].key,
                        collection,
                    }}
                    article={articles[0]}
                    size={rowProps.size}
                />
                <Card
                    style={[
                        styles.card,
                        styles.rightCard,
                        {
                            borderColor: appearance.backgrounds.borderColor,
                        },
                    ]}
                    path={{
                        article: articles[1].key,
                        collection,
                    }}
                    article={articles[1]}
                    size={rowProps.size}
                />
            </View>
        </Row>
    )
}

export { RowWithTwoArticles, RowWithArticle }
