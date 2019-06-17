import React, { ReactNode } from 'react'
import { StyleSheet, Animated, View } from 'react-native'
import { Multiline } from '../../multiline'
import { metrics } from '../../../theme/spacing'

import { useArticleAppearance } from '../../../theme/appearance'
import { Card } from './../card-group/card'
import { FrontArticle } from '../../../common'
import { PropTypes as CardGroupPropTypes } from '../card-group'

export enum Size {
    row,
    fourth,
    third,
    half,
    hero,
    superhero,
}

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
    translate: CardGroupPropTypes['translate']
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
    size,
    ...rowProps
}: {
    size: Size
    article: FrontArticle
} & RowPropTypes) => (
    <Row {...rowProps}>
        <Card
            style={styles.card}
            path={article.path}
            article={article}
            size={size}
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
    size,
    ...rowProps
}: {
    size: Size
    articles: [FrontArticle, FrontArticle]
} & RowPropTypes) => {
    const { appearance } = useArticleAppearance()

    /*
    we can't fully enforce this article pair so if 
    something goes wrong and we are missing article #2 
    we fall back to 1 article
    */
    if (!articles[1])
        return (
            <RowWithArticle {...rowProps} {...{ size }} article={articles[0]} />
        )
    return (
        <Row {...rowProps}>
            <View style={styles.doubleRow}>
                <Card
                    style={[styles.card]}
                    path={articles[0].path}
                    article={articles[0]}
                    size={size}
                />
                <Card
                    style={[
                        styles.card,
                        styles.rightCard,
                        {
                            borderColor: appearance.backgrounds.borderColor,
                        },
                    ]}
                    path={articles[1].path}
                    article={articles[1]}
                    size={size}
                />
            </View>
        </Row>
    )
}

export { RowWithTwoArticles, RowWithArticle }
