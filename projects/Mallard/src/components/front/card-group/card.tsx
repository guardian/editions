import React from 'react'
import { View, StyleSheet, StyleProp, ViewStyle, Image } from 'react-native'
import { metrics } from '../../../theme/spacing'
import { withNavigation, NavigationInjectedProps } from 'react-navigation'
import { Highlight } from '../../highlight'

import { useArticleAppearance } from '../../../theme/appearance'
import { FrontArticle } from '../../../common'

import { TextBlock } from './text-block'

const styles = StyleSheet.create({
    root: {
        padding: metrics.horizontal / 2,
        paddingVertical: metrics.vertical / 2,
    },
    elastic: {
        flexGrow: 1,
        flexShrink: 0,
        flexBasis: '100%',
    },
})

interface PropTypes {
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
    }: PropTypes & NavigationInjectedProps<{}>) => {
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
                        <Image
                            style={{
                                width: '100%',
                                flex: 1,
                            }}
                            source={{
                                uri: 'https://placekitten.com/200/200',
                            }}
                        />
                        <TextBlock
                            kicker={article.kicker}
                            headline={article.headline}
                            textBlockAppearance={'pillarColor'}
                        />
                    </View>
                </Highlight>
            </View>
        )
    },
)

export { SmallCard }
