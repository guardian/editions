import React, { useMemo } from 'react'
import { View, StyleSheet, StyleProp, ViewStyle } from 'react-native'
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
    style: StyleProp<ViewStyle & {}>
    stories: Story[]
    length?: number
}

const FrontCardGroupWithAppearance = ({
    style,
    stories,
    length,
}: PropTypes) => {
    const { appearance } = useArticleAppearance()
    const trimmed = useMemo(() => stories.slice(0, length), [stories, length])
    return (
        <View style={[styles.root, style, appearance.backgrounds]}>
            {trimmed.map((story, i) => (
                <View style={styles.row} key={i}>
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
                </View>
            ))}
        </View>
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
