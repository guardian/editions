import React from 'react'
import { StyleSheet, Animated, View } from 'react-native'
import { metrics } from 'src/theme/spacing'

import { useArticleAppearance } from 'src/theme/appearance'
import { color } from 'src/theme/color'
import { Row } from './row'
import { CAPIArticle, Issue, Collection, Front } from 'src/common'
import { PageLayout } from '../helpers'
import { FlexErrorMessage } from 'src/components/layout/ui/errors/flex-error-message'
import {
    splashPage,
    twoStoryPage,
    superHeroPage,
    threeStoryPage,
    fourStoryPage,
    fiveStoryPage,
    sixStoryPage,
} from '../layouts'
import { PathToArticle } from 'src/screens/article-screen'
import { ArticleNavigator } from '../../../screens/article-screen'

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
        flex: 1,
        margin: metrics.frontsPageSides,
        marginBottom: 32,
        marginTop: 8,
    },
})

export interface PropTypes {
    articlesInCard: CAPIArticle[]
    articleNavigator: ArticleNavigator
    issue: Issue['key']
    front: Front['key']
    pageLayout?: PageLayout
    collection: Collection['key']
}

const CollectionPage = ({
    articlesInCard,
    articleNavigator,
    collection,
    translate,
    issue,
    front,
    pageLayout,
}: { translate: Animated.AnimatedInterpolation } & PropTypes) => {
    const { appearance } = useArticleAppearance()
    if (!articlesInCard.length) {
        return <FlexErrorMessage />
    }
    if (!pageLayout) {
        switch (articlesInCard.length) {
            // case 1:
            //     pageLayout = superHeroPage
            //     break
            //THIS IS JUST FOR DEVELOPMENT TODO: Make this layout work from API
            case 1:
                pageLayout = superHeroPage
                break
            case 2:
                pageLayout = twoStoryPage
                break
            case 3:
                pageLayout = threeStoryPage
                break
            case 4:
                pageLayout = fourStoryPage
                break
            case 5:
                pageLayout = fiveStoryPage
                break
            default:
                pageLayout = sixStoryPage
        }
    }
    return (
        <View style={[styles.root, appearance.backgrounds]}>
            {pageLayout.map((row, index) => (
                <Row
                    index={index}
                    key={index}
                    front={front}
                    articles={
                        row.columns[1]
                            ? [
                                  articlesInCard[row.columns[0].slot],
                                  articlesInCard[row.columns[1].slot],
                              ]
                            : [articlesInCard[row.columns[0].slot]]
                    }
                    {...{ collection, issue, translate, row, articleNavigator }}
                />
            ))}
        </View>
    )
}

export { CollectionPage }
