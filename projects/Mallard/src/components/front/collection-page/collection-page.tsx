import React from 'react'
import { StyleSheet, Animated, View, Text } from 'react-native'
import { metrics } from 'src/theme/spacing'

import { color } from 'src/theme/color'
import { Row } from './row'
import {
    CAPIArticle,
    Issue,
    Collection,
    Front,
    defaultCardAppearances,
    FrontCardAppearance,
} from 'src/common'
import {
    useCardBackgroundStyle,
    RowSize,
    NewPageLayout,
    ItemFit,
    getPageLayoutSizeXY,
} from '../helpers'
import { FlexErrorMessage } from 'src/components/layout/ui/errors/flex-error-message'
import { layouts, newThreeStoryPage } from '../layouts'
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
    appearance: FrontCardAppearance | null
    collection: Collection['key']
}

const getPageLayout = (
    appearance: FrontCardAppearance | null,
    length: number,
) => {
    if (!appearance) {
        if (
            length === 1 ||
            length === 2 ||
            length === 3 ||
            length === 4 ||
            length === 5 ||
            length === 6
        ) {
            return layouts[defaultCardAppearances[length]]
        }
        return layouts[defaultCardAppearances[6]]
    } else {
        return layouts[appearance]
    }
}

const getItemPosition = (itemFit: ItemFit, layout: NewPageLayout['size']) => {
    const layoutSize = getPageLayoutSizeXY(layout)
    return {
        left: `${(itemFit.left / layoutSize.width) * 100}%`,
        top: `${(itemFit.top / layoutSize.height) * 100}%`,
        height: `${(itemFit.height / layoutSize.height) * 100}%`,
        width: `${(itemFit.width / layoutSize.width) * 100}%`,
    }
}

const CollectionPage = ({
    articlesInCard,
    articleNavigator,
    collection,
    translate,
    issue,
    front,
    appearance,
}: { translate: Animated.AnimatedInterpolation } & PropTypes) => {
    const background = useCardBackgroundStyle()
    if (!articlesInCard.length) {
        return <FlexErrorMessage />
    }

    const pageLayout = getPageLayout(appearance, articlesInCard.length)
    const layout = newThreeStoryPage

    return (
        <View style={[styles.root, background]}>
            {layout.items.map((story, index) => {
                const Item = story.item
                if (!articlesInCard[index]) return null
                const article = articlesInCard[index]
                return (
                    <View
                        style={[
                            {
                                borderColor: 'blue',
                                borderWidth: 2,
                                position: 'absolute',
                            },
                            getItemPosition(story.fits, layout.size),
                        ]}
                    >
                        <Item
                            style={{}}
                            REPLACEMEFORSIZE={{
                                story: story.fits,
                                layout: layout.size,
                            }}
                            size={RowSize.superhero}
                            path={{
                                article: article.key,
                                collection,
                                issue,
                                front,
                            }}
                            articleNavigator={articleNavigator}
                            article={article}
                        />
                    </View>
                )
            })}
        </View>
    )

    return (
        <View style={[styles.root, background]}>
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
