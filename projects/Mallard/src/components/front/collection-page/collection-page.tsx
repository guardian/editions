import React, { ReactNode } from 'react'
import { StyleSheet, StyleProp, Animated } from 'react-native'
import { metrics } from 'src/theme/spacing'

import {
    WithArticleAppearance,
    useArticleAppearance,
    ArticleAppearance,
} from 'src/theme/appearance'
import { color } from 'src/theme/color'
import { RowWithArticles } from './row'
import { Article, Issue, Collection } from 'src/common'
import { PageLayout } from '../helpers'
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
    pageLayout: PageLayout
    collection: Collection['key']
}

const CollectionPageWithAppearance = ({
    articles,
    collection,
    translate,
    issue,
    pageLayout,
}: PropTypes) => {
    if (!articles.length) {
        return <FlexErrorMessage icon="🐶" title="bark! im empty" />
    }
    return (
        <>
            {pageLayout.map((row, index) => (
                <RowWithArticles
                    index={index}
                    key={index}
                    articles={
                        row.columns[1]
                            ? [
                                  articles[row.columns[0].slot],
                                  articles[row.columns[1].slot],
                              ]
                            : [articles[row.columns[0].slot]]
                    }
                    {...{ collection, issue, translate, row }}
                />
            ))}
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
    style,
    ...props
}: {
    appearance: ArticleAppearance
    style: StyleProp<{}>
} & PropTypes) => (
    <WithArticleAppearance value={appearance}>
        <Wrapper style={style}>
            <CollectionPageWithAppearance {...props} />
        </Wrapper>
    </WithArticleAppearance>
)

CollectionPage.defaultProps = {
    stories: [],
}
export { CollectionPage }
