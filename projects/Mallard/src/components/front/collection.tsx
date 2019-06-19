import React, { ReactNode } from 'react'
import { StyleSheet, StyleProp, Animated } from 'react-native'
import { metrics } from '../../theme/spacing'

import {
    WithArticleAppearance,
    useArticleAppearance,
    ArticleAppearance,
} from '../../theme/appearance'
import { color } from '../../theme/color'
import { FrontArticle } from '../../common'
import { RowWithArticle, RowWithTwoArticles } from './card-group/row'

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
    articles: FrontArticle[]
    translate: Animated.AnimatedInterpolation
}

const AnyStoryCollection = ({ articles, translate }: PropTypes) => {
    return (
        <>
            {articles.map((article, index) => (
                <RowWithArticle
                    index={index}
                    key={index}
                    isLastChild={index === articles.length}
                    translate={translate}
                    article={article}
                />
            ))}
        </>
    )
}

const ThreeStoryCollection = ({ articles, translate }: PropTypes) => {
    /*
    if something goes wrong and there's less 
    stuff than expected we fall back to using 
    a flexible container rather than crash
    */
    if (articles.length < 3)
        return <AnyStoryCollection {...{ articles, translate }} />

    return (
        <>
            <RowWithTwoArticles
                index={0}
                isLastChild={false}
                translate={translate}
                articles={[articles[0], articles[1]]}
            />
            <RowWithArticle
                index={0}
                isLastChild={false}
                translate={translate}
                article={articles[2]}
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
