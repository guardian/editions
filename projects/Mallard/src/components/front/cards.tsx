import React from 'react'
import { View, StyleSheet, StyleProp, ViewStyle } from 'react-native'
import { metrics } from '../../theme/spacing'
import { withNavigation, NavigationInjectedProps } from 'react-navigation'
import { Highlight } from '../highlight'
import { HeadlineCardText, HeadlineKickerText } from '../styled-text'

import { useArticleAppearance } from '../../theme/appearance'

const styles = StyleSheet.create({
    root: {
        padding: metrics.horizontal,
        paddingVertical: metrics.vertical / 2,
    },
    elastic: {
        flexGrow: 1,
        flexShrink: 0,
        flexBasis: '100%',
    },
})
const SmallCard = withNavigation(
    ({
        style,
        headline,
        kicker,
        path,
        navigation,
    }: NavigationInjectedProps & {
        style: StyleProp<ViewStyle>
        headline: string
        kicker: string
        path: string
    }) => {
        const { appearance } = useArticleAppearance()
        return (
            <View style={style}>
                <Highlight
                    style={{ flex: 1 }}
                    onPress={() => navigation.navigate('Article', { path })}
                >
                    <View
                        style={[
                            styles.elastic,
                            styles.root,
                            appearance.backgrounds,
                            appearance.cardBackgrounds,
                        ]}
                    >
                        <HeadlineKickerText
                            style={[appearance.text, appearance.kicker]}
                        >
                            {kicker}
                        </HeadlineKickerText>
                        <HeadlineCardText
                            style={[appearance.text, appearance.headline]}
                        >
                            {headline}
                        </HeadlineCardText>
                    </View>
                </Highlight>
            </View>
        )
    },
)

export { SmallCard }
