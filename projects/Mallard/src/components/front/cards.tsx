import React from 'react'
import { View, StyleSheet, StyleProp, ViewStyle } from 'react-native'
import { metrics } from '../../theme/spacing'
import { withNavigation, NavigationInjectedProps } from 'react-navigation'
import { Highlight } from '../highlight'
import { HeadlineCardText, HeadlineKickerText } from '../styled-text'

import { useArticleAppearance } from '../../theme/appearance'
import { FrontArticle } from '../../common'

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
interface SmallCardProps {
    style: StyleProp<ViewStyle>
    article: FrontArticle
    path: FrontArticle['path']
}

const SmallCard = withNavigation(
    ({
        style,
        article,
        path,
        navigation,
    }: SmallCardProps & NavigationInjectedProps<{}>) => {
        const { appearance } = useArticleAppearance()
        return (
            <View style={style}>
                <Highlight
                    onPress={() => {
                        navigation.navigate('Article', {
                            article,
                            path,
                        })
                    }}
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
                            {article.kicker}
                        </HeadlineKickerText>
                        <HeadlineCardText
                            style={[appearance.text, appearance.headline]}
                        >
                            {article.headline}
                        </HeadlineCardText>
                    </View>
                </Highlight>
            </View>
        )
    },
)

export { SmallCard }
