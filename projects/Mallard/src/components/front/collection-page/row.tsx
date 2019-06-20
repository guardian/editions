import React, { ReactNode, useMemo } from 'react'
import { StyleSheet, Animated, View } from 'react-native'
import { Multiline } from '../../multiline'
import { metrics } from 'src/theme/spacing'

import { useArticleAppearance } from 'src/theme/appearance'
import { PropTypes as CollectionPropTypes } from './collection-page'
import { Article, Collection, Issue } from 'src/common'
import { Item } from '../item/item'
import { RowSize, getHeightForSize } from '../helpers'

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
    rightItem: {
        borderLeftWidth: StyleSheet.hairlineWidth,
    },
})

interface NavigationPropTypes {
    collection: Collection['key']
    issue: Issue['key']
}
interface RowPropTypes {
    translate: CollectionPropTypes['translate']
    index: number
    size: RowSize
}

/*
this is the low level row that actually takes in children. do not export
*/
const Row = ({
    children,
    translate,
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
                                outputRange: [10 * index, 0, -10 * index],
                            }),
                        },
                    ],
                },
            ]}
        >
            {index !== 0 ? (
                <Multiline
                    color={appearance.backgrounds.borderColor}
                    count={2}
                />
            ) : null}
            {children}
        </Animated.View>
    )
}

/*
ROW WITH ARTICLE
shows 1 article
*/
const RowWithOneArticle = ({
    article,
    collection,
    issue,
    ...rowProps
}: {
    article: Article
} & NavigationPropTypes &
    RowPropTypes) => (
    <Row {...rowProps}>
        <Item
            style={styles.card}
            size={rowProps.size}
            path={{
                article: article.key,
                collection,
                issue,
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
    issue,
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
            <RowWithOneArticle
                {...rowProps}
                {...{ issue, collection }}
                article={articles[0]}
            />
        )
    return (
        <Row {...rowProps}>
            <View style={styles.doubleRow}>
                <Item
                    style={[styles.card]}
                    path={{
                        article: articles[0].key,
                        collection,
                        issue,
                    }}
                    article={articles[0]}
                    size={rowProps.size}
                />
                <Item
                    style={[
                        styles.card,
                        styles.rightItem,
                        {
                            borderColor: appearance.backgrounds.borderColor,
                        },
                    ]}
                    path={{
                        article: articles[1].key,
                        collection,
                        issue,
                    }}
                    article={articles[1]}
                    size={rowProps.size}
                />
            </View>
        </Row>
    )
}

export { RowWithTwoArticles, RowWithOneArticle }
