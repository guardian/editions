import React, { ReactNode } from 'react'
import { StyleSheet, StyleProp, Animated } from 'react-native'
import { metrics } from 'src/theme/spacing'

import {
    WithArticleAppearance,
    useArticleAppearance,
    ArticleAppearance,
} from 'src/theme/appearance'
import { color } from 'src/theme/color'
import { RowWithOneArticle, RowWithTwoArticles } from './row'
import { Article, Collection as CollectionType } from 'src/common'
import { Issue } from '../../../../../backend/common'
import { RowSize, PageAppearance } from '../helpers'
import { FlexErrorMessage } from 'src/components/layout/errors/flex-error-message'

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
        margin: metrics.frontsPageSides,
        marginVertical: metrics.vertical,
    },
})

export interface PropTypes {
    articles: Article[]
    translate: Animated.AnimatedInterpolation
    issue: Issue['key']
    collection: Collection['key']
}

const AnyStoryCollectionPage = ({
    articles,
    collection,
    translate,
    issue,
}: PropTypes) => {
    if (!articles.length) {
        return <FlexErrorMessage icon="🐶" title="bark! im empty" />
    }
    return (
        <>
            {articles.map((article, index) => (
                <RowWithOneArticle
                    index={index}
                    key={index}
                    article={article}
                    {...{ collection, issue, translate }}
                    size={RowSize.row}
                />
            ))}
        </>
    )
}

const SingleStoryCollectionPage = ({
    articles,
    collection,
    translate,
    issue,
}: PropTypes) => {
    if (articles.length < 1)
        return (
            <AnyStoryCollectionPage
                {...{ articles, collection, translate, issue }}
            />
        )
    return (
        <>
            <RowWithOneArticle
                index={0}
                article={articles[0]}
                size={RowSize.superhero}
                {...{ collection, issue, translate }}
            />
        </>
    )
}

const ThreeStoryCollectionPage = ({
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
            <AnyStoryCollectionPage
                {...{ articles, collection, translate, issue }}
            />
        )

    return (
        <>
            <RowWithOneArticle
                index={0}
                article={articles[2]}
                size={RowSize.hero}
                {...{ collection, issue, translate }}
            />
            <RowWithTwoArticles
                index={1}
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
            {pageAppearance >= PageAppearance.superhero ? (
                <SingleStoryCollectionPage {...props} />
            ) : pageAppearance >= PageAppearance.three ? (
                <ThreeStoryCollectionPage {...props} />
            ) : (
                <AnyStoryCollectionPage {...props} />
            )}
        </Wrapper>
    </WithArticleAppearance>
)

CollectionPage.defaultProps = {
    stories: [],
}
export { CollectionPage }
