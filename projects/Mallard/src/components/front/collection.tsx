import React, { ReactNode } from 'react'
import { StyleSheet, StyleProp, Animated } from 'react-native'
import { metrics } from '../../theme/spacing'

import {
    WithArticleAppearance,
    useArticleAppearance,
    ArticleAppearance,
} from '../../theme/appearance'
import { color } from '../../theme/color'
import { RowWithArticle, RowWithTwoArticles, Size } from './card-group/row'
import { Article, Collection as CollectionType } from '../../common'

const styles = StyleSheet.create({
    root: {
        flexDirection: 'column',
        alignItems: 'stretch',
        justifyContent: 'center',
        shadowColor: color.text,
        shadowOffset: {
            width: 0,
            height: 2,
        },
        shadowOpacity: 0.1,
        shadowRadius: 3.84,
        elevation: 2,
        borderRadius: 2,
        margin: metrics.horizontal,
        marginVertical: metrics.vertical,
    },
})

export interface PropTypes {
    articles: Article[]
    collection: CollectionType['key']
    translate: Animated.AnimatedInterpolation
}

const AnyStoryCollection = ({ articles, collection, translate }: PropTypes) => {
    return (
        <>
            {articles.map((article, index) => (
                <RowWithArticle
                    index={index}
                    key={index}
                    isLastChild={index === articles.length - 1}
                    translate={translate}
                    article={article}
                    collection={collection}
                    size={Size.row}
                />
            ))}
        </>
    )
}

const ThreeStoryCollection = ({
    articles,
    collection,
    translate,
}: PropTypes) => {
    /*
    if something goes wrong and there's less 
    stuff than expected we fall back to using 
    a flexible container rather than crash
    */
    if (articles.length !== 3)
        return <AnyStoryCollection {...{ articles, collection, translate }} />

    return (
        <>
            <RowWithArticle
                index={0}
                isLastChild={false}
                translate={translate}
                article={articles[2]}
                size={Size.hero}
                collection={collection}
            />
            <RowWithTwoArticles
                index={1}
                isLastChild={true}
                translate={translate}
                articles={[articles[0], articles[1]]}
                size={Size.third}
                collection={collection}
            />
        </>
    )
}

const Wrapper = ({
    style,
    children,
}: {
    style: StyleProp<{}>
    children: ReactNode
}) => {
    const { appearance } = useArticleAppearance()
    return (
        <Animated.View style={[styles.root, style, appearance.backgrounds]}>
            {children}
        </Animated.View>
    )
}

const Collection = ({
    appearance,
    style,
    ...props
}: {
    appearance: ArticleAppearance
    style: StyleProp<{}>
} & PropTypes) => (
    <WithArticleAppearance value={appearance}>
        <Wrapper style={style}>
            <ThreeStoryCollection {...props} />
        </Wrapper>
    </WithArticleAppearance>
)

Collection.defaultProps = {
    stories: [],
}
export { Collection }
