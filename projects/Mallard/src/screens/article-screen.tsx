import React from 'react'
import { View, Text, StyleSheet, Button, Platform } from 'react-native'
import { HeadlineText } from '../components/styled-text'
import { useEndpoint } from '../hooks/use-fetch'
import { NavigationScreenProp } from 'react-navigation'
import { color } from '../theme/color'
import { metrics } from '../theme/spacing'
import { SlideCard } from '../components/layout/slide-card'
import {
    useArticleAppearance,
    WithArticleAppearance,
    articleAppearances,
} from '../theme/appearance'
import { TouchableHighlight } from 'react-native-gesture-handler'
import { Chevron } from '../components/chevron'

const styles = StyleSheet.create({
    container: {
        flex: 1,
    },
    card: {
        flexShrink: 0,
        alignItems: 'flex-start',
        padding: metrics.horizontal,
        paddingVertical: metrics.vertical / 2,
        borderBottomWidth: 1,
        ...articleAppearances.default.card,
    },
    headline: {
        ...articleAppearances.default.headline,
    },
    block: {
        alignItems: 'flex-start',
        padding: metrics.horizontal,
        paddingVertical: metrics.vertical,
    },
})

const useArticleData = (articleId, { headline }) => {
    return useEndpoint('', [headline, [[]]], res => res[articleId])
}

export const ArticleScreen = ({
    navigation,
}: {
    navigation: NavigationScreenProp<{}>
}) => {
    const article = navigation.getParam('article', -1)
    const headlineFromUrl = navigation.getParam(
        'headline',
        'HEADLINE NOT FOUND',
    )
    const [headline, [articleData]] = useArticleData(article, {
        headline: headlineFromUrl,
    })

    return (
        <WithArticleAppearance
            value={['news', 'lifestyle', 'comment', 'default'][article % 4]}
        >
            <ArticleScreenContents
                {...{ article, articleData, headline, navigation }}
            />
        </WithArticleAppearance>
    )
}

const ArticleScreenContents = ({
    navigation,
    articleData,
    headline,
}: {
    navigation: NavigationScreenProp<{}>
    articleData: {}
    headline: string
}) => {
    const appearance = useArticleAppearance()
    return (
        <SlideCard
            header={
                <TouchableHighlight
                    onPress={() => {
                        navigation.goBack()
                    }}
                    accessibilityHint="Go back"
                >
                    <View style={[styles.card, appearance.card]}>
                        <Chevron />
                    </View>
                </TouchableHighlight>
            }
            onDismiss={() => {
                navigation.goBack()
            }}
        >
            <View style={styles.container}>
                <View style={[styles.card, appearance.card]}>
                    <HeadlineText
                        style={[styles.headline, appearance.headline]}
                    >
                        {headline}
                    </HeadlineText>
                </View>
                <View style={{ backgroundColor: color.background, flex: 1 }}>
                    {articleData
                        .filter(el => el.type === 0)
                        .map((el, index) => (
                            <View style={styles.block} key={index}>
                                <Text>{el.textTypeData.html}</Text>
                            </View>
                        ))}
                </View>
            </View>
        </SlideCard>
    )
}

ArticleScreen.navigationOptions = ({ navigation }) => ({
    title: navigation.getParam('article', 'NO-ID'),
})
