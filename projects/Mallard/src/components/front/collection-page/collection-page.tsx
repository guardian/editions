import React from 'react'
import { StyleSheet, Animated, View } from 'react-native'
import { metrics } from 'src/theme/spacing'

import { color } from 'src/theme/color'
import { Row } from './row'
import {
    CAPIArticle,
    Issue,
    Collection,
    Front,
    defaultAppearances,
    CollectionCardAppearance,
} from 'src/common'
import { useCardBackgroundStyle } from '../helpers'
import { FlexErrorMessage } from 'src/components/layout/ui/errors/flex-error-message'
import { layouts } from '../layouts'
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
    appearance: CollectionCardAppearance | null
    collection: Collection['key']
}

const getPageLayout = (
    appearance: CollectionCardAppearance | null,
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
            console.log(length)
            return layouts[defaultAppearances[length]]
        }
        return layouts[defaultAppearances[6]]
    } else {
        return layouts[appearance]
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
