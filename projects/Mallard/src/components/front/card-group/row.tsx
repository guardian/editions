import React, { ReactNode } from 'react'
import { StyleSheet, Animated, View } from 'react-native'
import { Multiline } from '../../multiline'
import { metrics } from '../../../theme/spacing'

import { useArticleAppearance } from '../../../theme/appearance'
import { SmallCard } from './../card-group/card'
import { FrontArticle } from '../../../common'
import { PropTypes as CardGroupPropTypes } from '../card-group'

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

export const RowWithArticle = ({
    article,
    ...rowProps
}: {
    article: FrontArticle
} & RowPropTypes) => (
    <Row {...rowProps}>
        <SmallCard style={styles.card} path={article.path} article={article} />
    </Row>
)

export const RowWithTwoArticles = ({
    articles,
    ...rowProps
}: {
    articles: [FrontArticle, FrontArticle]
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
                    path={articles[0].path}
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
                    path={articles[1].path}
                    article={articles[1]}
                />
            </View>
        </Row>
    )
}
