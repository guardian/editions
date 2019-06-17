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

type ImageComposition = 'default' | 'cover'

const SmallCard = withNavigation(
    ({
        style,
        article,
        path,
        navigation,
    }: PropTypes & NavigationInjectedProps<{}>) => {
        const { appearance } = useArticleAppearance()
        /* gotta derive these from appearance+size */
        const textBlockAppearance = 'pillarColor'
        const imageComposition: ImageComposition = 'cover'
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
                        {imageComposition === 'cover' ? (
                            <View style={{ width: '100%', height: '100%' }}>
                                <Image
                                    style={{
                                        width: '100%',
                                        height: '100%',
                                        flex: 1,
                                    }}
                                    source={{
                                        uri: 'https://placekitten.com/200/200',
                                    }}
                                />
                                <TextBlock
                                    kicker={article.kicker}
                                    headline={article.headline}
                                    textBlockAppearance={textBlockAppearance}
                                    style={{
                                        width: '50%',
                                        position: 'absolute',
                                        bottom: 0,
                                        left: 0,
                                    }}
                                />
                            </View>
                        ) : (
                            <>
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
                                    textBlockAppearance={textBlockAppearance}
                                />
                            </>
                        )}
                    </View>
                </Highlight>
            </View>
        )
    },
)

export { SmallCard }
