import React, { ReactNode } from 'react'
import { StyleSheet, Animated, View } from 'react-native'
import { Multiline } from '../../multiline'
import { metrics } from '../../../theme/spacing'

import { useArticleAppearance } from '../../../theme/appearance'
import { SmallCard } from './../card-group/card'
import { PropTypes as CollectionPropTypes } from '../collection'
import { Article } from 'src/common'

const styles = StyleSheet.create({
    row: {
        flexBasis: 0,
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

interface RowPropTypes {
    translate: CollectionPropTypes['translate']
    isLastChild: boolean
    index: number
}

/*
this is the low level row that actually takes in children. do not export
*/
const Row = ({
    children,
    translate,
    isLastChild,
    index,
}: {
    children: ReactNode
} & RowPropTypes) => {
    const { appearance } = useArticleAppearance()
    return (
        <Animated.View
            style={[
                styles.row,
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
    ...rowProps
}: {
    article: Article
} & RowPropTypes) => (
    <Row {...rowProps}>
        <SmallCard style={styles.card} path={article.key} article={article} />
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
    ...rowProps
}: {
    articles: [Article, Article]
} & RowPropTypes) => {
    const { appearance } = useArticleAppearance()

    /*
    we can't fully enforce this article pair so if 
    something goes wrong and we are missing article #2 
    we fall back to 1 article
    */
    if (!articles[1])
        return <RowWithArticle {...rowProps} article={articles[0]} />
    return (
        <Row {...rowProps}>
            <View style={styles.doubleRow}>
                <SmallCard
                    style={[styles.card]}
                    path={articles[0].key}
                    article={articles[0]}
                />
                <SmallCard
                    style={[
                        styles.card,
                        styles.rightCard,
                        {
                            borderColor: appearance.backgrounds.borderColor,
                        },
                    ]}
                    path={articles[1].key}
                    article={articles[1]}
                />
            </View>
        </Row>
    )
}

export { RowWithTwoArticles, RowWithArticle }
