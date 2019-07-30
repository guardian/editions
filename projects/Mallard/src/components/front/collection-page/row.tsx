import React, { ReactNode, useMemo } from 'react'
import { StyleSheet, Animated, View } from 'react-native'
import { Multiline } from '../../multiline'
import { metrics } from 'src/theme/spacing'

import { CAPIArticle, Collection, Issue, Front } from 'src/common'
import { getRowHeightForSize, RowLayout } from '../helpers'
import { ArticleNavigator } from '../../../screens/article-screen'
import { color } from 'src/theme/color'

const styles = StyleSheet.create({
    row: {
        flex: 0,
        overflow: 'hidden',
        flexBasis: 'auto',
        flexDirection: 'column',
        alignItems: 'stretch',
        justifyContent: 'space-between',
    },
    doubleRow: {
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
    articleNavigator: ArticleNavigator
    collection: Collection['key']
    issue: Issue['key']
    front: Front['key']
}
interface RowPropTypes {
    translate: Animated.AnimatedInterpolation
    index: number
    row: RowLayout
}

/*
this is the low level row that actually takes in children. do not export
*/
const RowWithChildren = ({
    children,
    translate,
    index,
    row,
}: {
    children: ReactNode
} & RowPropTypes) => {
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
            {index !== 0 ? <Multiline color={color.line} count={2} /> : null}
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
    articleNavigator,
    issue,
    row,
    front,
    ...rowProps
}: {
    article: CAPIArticle
} & NavigationPropTypes &
    RowPropTypes) => {
    const { Item } = row.columns[0]
    return (
        <RowWithChildren {...rowProps} {...{ row }}>
            <Item
                style={styles.card}
                size={row.size}
                path={{
                    article: article.key,
                    collection,
                    issue,
                    front,
                }}
                articleNavigator={articleNavigator}
                article={article}
            />
        </RowWithChildren>
    )
}

/*
ROW
shows 2 articles side by side. If there's less
it falls back to a single row and if there's more
then it eats them up
*/
const Row = ({
    articles,
    collection,
    issue,
    row,
    front,
    articleNavigator,
    ...rowProps
}: {
    articles: [CAPIArticle] | [CAPIArticle, CAPIArticle]
} & NavigationPropTypes &
    RowPropTypes) => {
    if (row.columns.length !== 2 || !articles[1]) {
        if (!articles[0]) return null
        return (
            <RowWithOneArticle
                {...rowProps}
                {...{ issue, collection, front, row, articleNavigator }}
                article={articles[0]}
            />
        )
    }

    const [{ Item: FirstItem }, { Item: SecondItem }] = row.columns

    return (
        <RowWithChildren {...rowProps} {...{ row }}>
            <View style={styles.doubleRow}>
                <FirstItem
                    style={[styles.card]}
                    path={{
                        article: articles[0].key,
                        collection,
                        front,
                        issue,
                    }}
                    articleNavigator={articleNavigator}
                    article={articles[0]}
                    size={row.size}
                />
                <SecondItem
                    style={[
                        styles.card,
                        styles.rightItem,
                        {
                            borderColor: color.line,
                        },
                    ]}
                    path={{
                        article: articles[1].key,
                        collection,
                        front,
                        issue,
                    }}
                    articleNavigator={articleNavigator}
                    article={articles[1]}
                    size={row.size}
                />
            </View>
        </RowWithChildren>
    )
}

export { Row }
