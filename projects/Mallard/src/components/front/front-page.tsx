import React, { useMemo } from 'react'
import { View, StyleSheet } from 'react-native'
import { Multiline } from '../multiline'
import { metrics } from '../../theme/spacing'

import { Story } from '../../helpers/types'
import {
    WithArticleAppearance,
    useArticleAppearance,
    articleAppearances,
    ArticleAppearance,
} from '../../theme/appearance'
import { SmallCard } from './cards'

const styles = StyleSheet.create({
    root: {
        flexDirection: 'column',
        alignItems: 'stretch',
        justifyContent: 'center',
        shadowColor: '#000',
        shadowOffset: {
            width: 0,
            height: 2,
        },
        shadowOpacity: 0.1,
        shadowRadius: 3.84,
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
    style: { height: number }
    stories: Story[]
    length?: number
}

const FrontPageWithAppearance = ({ style, stories, length }: PropTypes) => {
    const { appearance } = useArticleAppearance()
    const trimmed = useMemo(() => stories.slice(0, length), [stories, length])
    return (
        <View style={[styles.root, style, appearance.backgrounds]}>
            {trimmed.map((story, i) => (
                <View style={styles.row}>
                    <SmallCard
                        style={styles.unit}
                        id={i}
                        kicker="Kicker"
                        headline={story[0]}
                    />
                    {i < trimmed.length - 1 && (
                        <Multiline
                            color={
                                articleAppearances.default.backgrounds
                                    .borderColor ||
                                appearance.backgrounds.borderColor
                            }
                            count={2}
                            style={{ flex: 0 }}
                        />
                    )}
                </View>
            ))}
        </View>
    )
}

const FrontPage = ({
    appearance,
    ...props
}: {
    appearance: ArticleAppearance
} & PropTypes) => (
    <WithArticleAppearance value={appearance}>
        <FrontPageWithAppearance {...props} />
    </WithArticleAppearance>
)

FrontPage.defaultProps = {
    stories: [],
}
export { FrontPage }
