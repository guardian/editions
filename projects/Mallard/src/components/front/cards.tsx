import React from 'react'
import { View, StyleSheet, StyleProp, ViewStyle } from 'react-native'
import { metrics } from '../../theme/spacing'
import { withNavigation, NavigationInjectedProps } from 'react-navigation'
import { Highlight } from '../highlight'
import { HeadlineCardText, HeadlineKickerText } from '../styled-text'

import { useArticleAppearance } from '../../theme/appearance'
import { FrontArticle } from '../../common'
import { Params } from '../../screens/article-screen'

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
}
type InjectedProps = NavigationInjectedProps<Params>
const InjectedSmallCard = withNavigation(
    ({ style, article, navigation }: SmallCardProps & InjectedProps) => {
        const { appearance } = useArticleAppearance()
        return (
            <View style={style}>
                <Highlight
                    onPress={() => {
                        console.log(article)
                        navigation.navigate('Article', { article: article })
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
) //Dirty type casting unti useNavigation hooks are stable

const SmallCard = (InjectedSmallCard as unknown) as React.FunctionComponent<
    SmallCardProps
>

export { SmallCard }
