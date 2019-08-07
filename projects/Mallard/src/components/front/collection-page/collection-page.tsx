import React from 'react'
import { StyleSheet, Animated, View, Text } from 'react-native'
import { metrics } from 'src/theme/spacing'

import { color } from 'src/theme/color'
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
    getItemPosition,
    getPageLayoutSizeXY,
} from '../helpers'
import { FlexErrorMessage } from 'src/components/layout/ui/errors/flex-error-message'
import { layouts } from '../layouts'
import { ArticleNavigator } from '../../../screens/article-screen'
import { Multiline } from 'src/components/multiline'

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
    itemHolder: {
        borderColor: color.line,
        position: 'absolute',
    },
    multiline: {
        position: 'absolute',
        bottom: 0,
        left: 0,
        right: 0,
        width: '100%',
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

const CollectionPage = ({
    articlesInCard,
    articleNavigator,
    collection,
    issue,
    front,
    appearance,
}: { translate: Animated.AnimatedInterpolation } & PropTypes) => {
    const background = useCardBackgroundStyle()
    if (!articlesInCard.length) {
        return <FlexErrorMessage />
    }

    const layout = getPageLayout(appearance, articlesInCard.length)

    return (
        <View style={[styles.root, background]}>
            {layout.items.map((story, index) => {
                const Item = story.item
                if (!articlesInCard[index]) return null
                const article = articlesInCard[index]
                return (
                    <View
                        style={[
                            styles.itemHolder,
                            getItemPosition(story.fits, layout.size),
                            story.fits.left + story.fits.width <
                                getPageLayoutSizeXY(layout.size).width && {
                                borderRightWidth: 1,
                            },
                        ]}
                    >
                        <Item
                            style={{}}
                            size={{
                                story: story.fits,
                                layout: layout.size,
                            }}
                            path={{
                                article: article.key,
                                collection,
                                issue,
                                front,
                            }}
                            articleNavigator={articleNavigator}
                            article={article}
                        />
                        {story.fits.top + story.fits.height <
                        getPageLayoutSizeXY(layout.size).height ? (
                            <Multiline
                                style={styles.multiline}
                                color={color.line}
                                count={2}
                            />
                        ) : null}
                    </View>
                )
            })}
        </View>
    )
}

export { CollectionPage }
