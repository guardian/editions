import React, { ReactNode, useMemo } from 'react'
import { StyleSheet, Animated, View } from 'react-native'
import { Multiline } from '../../multiline'
import { metrics } from 'src/theme/spacing'

import { useArticleAppearance } from 'src/theme/appearance'
import { PropTypes as CollectionPropTypes } from './collection-page'
import { Article, Collection, Issue } from 'src/common'
import { getRowHeightForSize, RowLayout } from '../helpers'

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
    row: RowLayout
}

/*
this is the low level row that actually takes in children. do not export
*/
const Row = ({
    children,
    translate,
    index,
    row,
}: {
    children: ReactNode
} & RowPropTypes) => {
    const { appearance } = useArticleAppearance()
    const height = useMemo(() => getRowHeightForSize(row.size), [row.size])
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
    row,
    ...rowProps
}: {
    article: Article
} & NavigationPropTypes &
    RowPropTypes) => {
    const { Item } = row.columns[0]
    return (
        <Row {...rowProps} {...{ row }}>
            <Item
                style={styles.card}
                size={row.size}
                path={{
                    article: article.key,
                    collection,
                    issue,
                }}
                article={article}
            />
        </Row>
    )
}

/*
ROW WITH ARTICLES
shows 2 articles side by side. If there's less 
it falls back to a single row and if there's more 
then it eats them up
*/
const RowWithArticles = ({
    articles,
    collection,
    issue,
    row,
    ...rowProps
}: {
    articles: [Article] | [Article, Article]
} & NavigationPropTypes &
    RowPropTypes) => {
    const { appearance } = useArticleAppearance()

    if (row.columns.length !== 2 || !articles[1]) {
        return (
            <RowWithOneArticle
                {...rowProps}
                {...{ issue, collection, row }}
                article={articles[0]}
            />
        )
    }

    const [{ Item: FirstItem }, { Item: SecondItem }] = row.columns

    return (
        <Row {...rowProps} {...{ row }}>
            <View style={styles.doubleRow}>
                <FirstItem
                    style={[styles.card]}
                    path={{
                        article: articles[0].key,
                        collection,
                        issue,
                    }}
                    article={articles[0]}
                    size={row.size}
                />
                <SecondItem
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
                    size={row.size}
                />
            </View>
        </Row>
    )
}

export { RowWithArticles, RowWithOneArticle }
