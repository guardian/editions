import React, { useMemo } from 'react'
import { StyleSheet, StyleProp, Animated } from 'react-native'
import { Multiline } from '../multiline'
import { metrics } from '../../theme/spacing'

import {
    WithArticleAppearance,
    useArticleAppearance,
    ArticleAppearance,
} from '../../theme/appearance'
import { SmallCard } from './cards'
import { color } from '../../theme/color'
import { ArticleFromTheCollectionsAtm } from '../../common'

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
    row: {
        flexBasis: 0,
        flexGrow: 1,
        flexDirection: 'column',
        alignItems: 'stretch',
        justifyContent: 'space-between',
    },
    unit: {
        flex: 1,
    },
})

interface PropTypes {
    style: StyleProp<{}>
    articles: ArticleFromTheCollectionsAtm[]
    length?: number
    translate: Animated.AnimatedInterpolation
}

const CardGroupWithAppearance = ({
    style,
    articles,
    length,
    translate,
}: PropTypes) => {
    const { appearance } = useArticleAppearance()
    const trimmed = useMemo(() => articles.slice(0, length), [articles, length])
    return (
        <Animated.View style={[styles.root, style, appearance.backgrounds]}>
            {trimmed.map((story, i) => (
                <Animated.View
                    style={[
                        styles.row,
                        {
                            transform: [
                                {
                                    translateX: translate.interpolate({
                                        inputRange: [
                                            metrics.horizontal * -1.5,
                                            0,
                                            metrics.horizontal * 1.5,
                                        ],
                                        outputRange: [60 * i, 0, -60 * i],
                                    }),
                                },
                            ],
                        },
                    ]}
                    key={i}
                >
                    <SmallCard
                        style={styles.unit}
                        path={story}
                        kicker="Kicker"
                        headline={story}
                    />
                    {i < trimmed.length - 1 && (
                        <Multiline
                            color={appearance.backgrounds.borderColor}
                            count={2}
                            style={{ flex: 0 }}
                        />
                    )}
                </Animated.View>
            ))}
        </Animated.View>
    )
}

const CardGroup = ({
    appearance,
    ...props
}: {
    appearance: ArticleAppearance
} & PropTypes) => (
    <WithArticleAppearance value={appearance}>
        <CardGroupWithAppearance {...props} />
    </WithArticleAppearance>
)

CardGroup.defaultProps = {
    stories: [],
}
export { CardGroup }
