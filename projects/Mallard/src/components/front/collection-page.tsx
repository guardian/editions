import React, { ReactNode } from 'react'
import { StyleSheet, StyleProp, Animated } from 'react-native'
import { metrics } from 'src/theme/spacing'

import {
    WithArticleAppearance,
    useArticleAppearance,
    ArticleAppearance,
} from 'src/theme/appearance'
import { color } from 'src/theme/color'
import { RowWithOneArticle, RowWithTwoArticles } from './card-group/row'
import { Article, Collection as CollectionType } from 'src/common'
import { Issue } from '../../../../backend/common'
import { RowSize } from './helpers'

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
    translate: Animated.AnimatedInterpolation
    issue: Issue['key']
    collection: CollectionType['key']
}

const AnyStoryCollection = ({
    articles,
    collection,
    translate,
    issue,
}: PropTypes) => {
    return (
        <>
            {articles.map((article, index) => (
                <RowWithOneArticle
                    index={index}
                    key={index}
                    isLastChild={index === articles.length - 1}
                    article={article}
                    {...{ collection, issue, translate }}
                    size={RowSize.row}
                />
            ))}
        </>
    )
}

const SingleStoryCollection = ({
    articles,
    collection,
    translate,
    issue,
}: PropTypes) => {
    if (articles.length < 1)
        return (
            <AnyStoryCollection
                {...{ articles, collection, translate, issue }}
            />
        )
    return (
        <>
            <RowWithOneArticle
                index={0}
                isLastChild={true}
                article={articles[0]}
                size={RowSize.superhero}
                {...{ collection, issue, translate }}
            />
        </>
    )
}

const ThreeStoryCollection = ({
    articles,
    collection,
    translate,
    issue,
}: PropTypes) => {
    /*
    if something goes wrong and there's less 
    stuff than expected we fall back to using 
    a flexible container rather than crash
    */
    if (articles.length !== 3)
        return (
            <AnyStoryCollection
                {...{ articles, collection, translate, issue }}
            />
        )

    return (
        <>
            <RowWithOneArticle
                index={0}
                isLastChild={false}
                article={articles[2]}
                size={RowSize.hero}
                {...{ collection, issue, translate }}
            />
            <RowWithTwoArticles
                index={1}
                isLastChild={true}
                translate={translate}
                articles={[articles[0], articles[1]]}
                size={RowSize.third}
                {...{ collection, issue, translate }}
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

export enum PageAppearance {
    superhero,
    two,
    three,
    four,
    five,
    six,
}

const CollectionPage = ({
    appearance,
    pageAppearance,
    style,
    ...props
}: {
    appearance: ArticleAppearance
    pageAppearance: PageAppearance
    style: StyleProp<{}>
} & PropTypes) => (
    <WithArticleAppearance value={appearance}>
        <Wrapper style={style}>
            {pageAppearance === PageAppearance.superhero ? (
                <SingleStoryCollection {...props} />
            ) : (
                <ThreeStoryCollection {...props} />
            )}
        </Wrapper>
    </WithArticleAppearance>
)

CollectionPage.defaultProps = {
    stories: [],
}
export { CollectionPage }
