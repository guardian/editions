import React, { useMemo } from 'react'
import { StyleSheet, StyleProp, Animated } from 'react-native'
import { Multiline } from '../multiline'
import { metrics } from '../../theme/spacing'

import { Story } from '../../helpers/types'
import {
    WithArticleAppearance,
    useArticleAppearance,
    ArticleAppearance,
} from '../../theme/appearance'
import { SmallCard } from './cards'
import { color } from '../../theme/color'

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
    stories: Story[]
    length?: number
    translate: Animated.Value
}

const FrontCardGroupWithAppearance = ({
    style,
    stories,
    length,
    translate,
}: PropTypes) => {
    const { appearance } = useArticleAppearance()
    const trimmed = useMemo(() => stories.slice(0, length), [stories, length])
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
                        id={i}
                        kicker="Kicker"
                        headline={story[0]}
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

const FrontCardGroup = ({
    appearance,
    ...props
}: {
    appearance: ArticleAppearance
} & PropTypes) => (
    <WithArticleAppearance value={appearance}>
        <FrontCardGroupWithAppearance {...props} />
    </WithArticleAppearance>
)

FrontCardGroup.defaultProps = {
    stories: [],
}
export { FrontCardGroup }
