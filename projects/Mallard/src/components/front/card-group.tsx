import React, { useMemo, ReactNode } from 'react'
import { StyleSheet, StyleProp, Animated, View } from 'react-native'
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
    doubleRow: {
        flex: 1,
        flexDirection: 'row',
        overflow: 'hidden',
        display: 'flex',
        justifyContent: 'center',
        alignItems: 'stretch',
    },
    unit: {
        flex: 1,
    },
    rightUnit: {
        borderLeftWidth: StyleSheet.hairlineWidth,
    },
})

interface PropTypes {
    style: StyleProp<{}>
    articles: ArticleFromTheCollectionsAtm[]
    length?: number
    translate: Animated.AnimatedInterpolation
}

const Row = ({
    children,
    translate,
    isLastChild,
    index,
}: {
    children: ReactNode
    translate: PropTypes['translate']
    isLastChild: boolean
    index: number
}) => {
    const { appearance } = useArticleAppearance()
    return (
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
                                outputRange: [60 * index, 0, -60 * index],
                            }),
                        },
                    ],
                },
            ]}
        >
            {children}
            {!isLastChild && (
                <Multiline
                    color={appearance.backgrounds.borderColor}
                    count={2}
                    style={{ flex: 0 }}
                />
            )}
        </Animated.View>
    )
}

const CardGroupWithAppearance = ({ style, articles, translate }: PropTypes) => {
    const { appearance } = useArticleAppearance()

    return (
        <Animated.View style={[styles.root, style, appearance.backgrounds]}>
            <Row index={0} isLastChild={false} translate={translate}>
                <View style={styles.doubleRow}>
                    <SmallCard
                        style={[styles.unit]}
                        path={articles[0]}
                        kicker="Kicker"
                        headline={articles[0]}
                    />
                    <SmallCard
                        style={[
                            styles.unit,
                            styles.rightUnit,
                            {
                                borderColor: appearance.backgrounds.borderColor,
                            },
                        ]}
                        path={articles[1]}
                        kicker="Kicker"
                        headline={articles[1]}
                    />
                </View>
            </Row>
            <Row index={1} isLastChild={true} translate={translate}>
                <SmallCard
                    style={styles.unit}
                    path={articles[2]}
                    kicker="Kicker"
                    headline={articles[2]}
                />
            </Row>
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
