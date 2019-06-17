import React, { useMemo } from 'react'
import { View, StyleSheet, StyleProp, ViewStyle, Image } from 'react-native'
import { metrics } from '../../../theme/spacing'
import { withNavigation, NavigationInjectedProps } from 'react-navigation'
import { Highlight } from '../../highlight'
import { HeadlineCardText, HeadlineKickerText } from '../../styled-text'

import { useArticleAppearance } from '../../../theme/appearance'
import { FrontArticle } from '../../../common'
import { color } from 'src/theme/color'

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

type TextBlockAppearance = 'default' | 'highlight' | 'pillarColor'

const textBlockStyles = {
    root: {
        paddingBottom: metrics.vertical,
        paddingTop: metrics.vertical / 3,
    },
    rootWithHighlight: {
        backgroundColor: color.palette.highlight.main,
        paddingHorizontal: metrics.horizontal / 2,
    },
    contrastText: {
        color: color.palette.neutral[100],
    },
    headline: {
        color: color.dimText,
    },
}

const useTextBlockStyles = (textBlockAppearance: TextBlockAppearance) => {
    const { appearance } = useArticleAppearance()
    switch (textBlockAppearance) {
        case 'highlight':
            return {
                rootStyle: [
                    textBlockStyles.root,
                    textBlockStyles.rootWithHighlight,
                ],
                kickerStyle: null,
                headlineStyle: textBlockStyles.headline,
            }
        case 'pillarColor':
            return {
                rootStyle: [
                    textBlockStyles.root,
                    textBlockStyles.rootWithHighlight,
                    appearance.contrastCardBackgrounds,
                ],
                kickerStyle: textBlockStyles.contrastText,
                headlineStyle: textBlockStyles.contrastText,
            }
        default:
            return {
                rootStyle: textBlockStyles.root,
                kickerStyle: [appearance.text, appearance.kicker],
                headlineStyle: [
                    textBlockStyles.headline,
                    appearance.text,
                    appearance.kicker,
                ],
            }
    }
}

const TextBlock = ({
    kicker,
    headline,
    appearance,
}: {
    kicker: string
    headline: string
    appearance: TextBlockAppearance
}) => {
    const { rootStyle, kickerStyle, headlineStyle } = useTextBlockStyles(
        appearance,
    )

    return (
        <View style={rootStyle}>
            <HeadlineKickerText style={kickerStyle}>
                Kick {kicker}
            </HeadlineKickerText>
            <HeadlineCardText style={headlineStyle}>
                headline {headline}
            </HeadlineCardText>
        </View>
    )
}

const SmallCard = withNavigation(
    ({
        style,
        article,
        path,
        navigation,
    }: PropTypes & NavigationInjectedProps<{}>) => {
        const { appearance } = useArticleAppearance()
        const blockAppearance = 'highlight'
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
                            appearance={'pillarColor'}
                        />
                    </View>
                </Highlight>
            </View>
        )
    },
)

export { SmallCard }
