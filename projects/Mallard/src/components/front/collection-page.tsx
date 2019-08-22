import React from 'react'
import { StyleSheet, Animated, View } from 'react-native'
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
    getItemRectanglePerc,
    getPageLayoutSizeXY,
    ItemSizes,
    toAbsoluteRectangle,
} from './helpers/helpers'
import { FlexErrorMessage } from 'src/components/layout/ui/errors/flex-error-message'
import { layouts } from './helpers/layouts'
import { ArticleNavigator } from '../../screens/article-screen'
import { Multiline } from 'src/components/multiline'
import { useIssueScreenSize } from 'src/screens/issue/use-size'

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
        margin: metrics.fronts.sides,
        marginTop: metrics.fronts.sides / 2,
        marginBottom: metrics.fronts.sides * 1.5,
    },
    itemHolder: {
        position: 'absolute',
    },
    multiline: {
        position: 'absolute',
        bottom: 0,
        left: 0,
        right: 0,
        width: '100%',
    },
    sideBorder: {
        position: 'absolute',
        right: 0,
        top: 0,
        bottom: 3,
        width: 1,
        backgroundColor: color.dimLine,
    },
    endCapSideBorder: {
        bottom: 0,
    },
    item: {
        ...StyleSheet.absoluteFillObject,
    },
})

export interface PropTypes {
    articlesInCard: CAPIArticle[]
    articleNavigator: ArticleNavigator
    issue: Issue['key']
    front: Front['key']
    appearance: FrontCardAppearance | null
    collection: Collection['key']
    width: number
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

const isNotRightMostStory = ({ story, layout }: ItemSizes) =>
    story.left + story.width < getPageLayoutSizeXY(layout).width

const isNotBottomMostStory = ({ story, layout }: ItemSizes) =>
    story.top + story.height < getPageLayoutSizeXY(layout).height

const CollectionPage = ({
    articlesInCard,
    articleNavigator,
    collection,
    issue,
    front,
    appearance,
}: { translate: Animated.AnimatedInterpolation } & PropTypes) => {
    const background = useCardBackgroundStyle()
    const { size, card } = useIssueScreenSize()
    if (!articlesInCard.length) {
        return <FlexErrorMessage />
    }

    const layout = getPageLayout(appearance, articlesInCard.length)[size]

    return (
        <View style={[styles.root, background]}>
            {layout.items.map((story, index) => {
                if (!articlesInCard[index]) return null
                const size = {
                    story: story.fits,
                    layout: layout.size,
                }
                const Item = story.item
                const article = articlesInCard[index]
                return (
                    <View
                        key={index}
                        style={[
                            styles.itemHolder,
                            toAbsoluteRectangle(
                                getItemRectanglePerc(story.fits, layout.size),
                                {
                                    width:
                                        card.width - metrics.fronts.sides * 2,
                                    height:
                                        card.height - metrics.fronts.sides * 2,
                                },
                            ),
                        ]}
                    >
                        <Item
                            path={{
                                article: article.key,
                                collection,
                                issue,
                                front,
                            }}
                            issueID={issue}
                            size={size}
                            articleNavigator={articleNavigator}
                            article={article}
                        />
                        {isNotRightMostStory(size) ? (
                            <View
                                style={[
                                    styles.sideBorder,
                                    !isNotBottomMostStory(size) &&
                                        styles.endCapSideBorder,
                                ]}
                            />
                        ) : null}
                        {isNotBottomMostStory(size) ? (
                            <Multiline
                                style={styles.multiline}
                                color={color.dimLine}
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
