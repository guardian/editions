import React from 'react'
import { View, Text, StyleSheet, Image } from 'react-native'
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
import {
    LongReadHeader,
    NewsHeader,
} from '../components/article/article-header'

const fixture = seed => ({
    image: [
        'https://media.guim.co.uk/1d046fd12d5685eacd943fcf2089f23ecc873e8b/0_224_6720_4032/1000.jpg',
        'https://i.guim.co.uk/img/media/aa751497cada64b193f8f3e640a3261eb0e16e81/424_255_4518_2711/master/4518.jpg?width=860&quality=45&auto=format&fit=max&dpr=2&s=5025f6e75a0cbb9a7cdecf948f1a54af',
        null,
    ][seed % 3],
    appearance: ['news', 'lifestyle', 'comment', 'longread'][seed % 4],
})

const styles = StyleSheet.create({
    container: {
        flex: 1,
    },
    header: {
        ...articleAppearances.default.cardAndPlaque,
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
    const { image, appearance } = fixture(article)
    return (
        <WithArticleAppearance value={appearance}>
            <ArticleScreenContents
                {...{ article, articleData, headline, navigation, image }}
            />
        </WithArticleAppearance>
    )
}

const ArticleScreenContents = ({
    navigation,
    articleData,
    headline,
    image,
}: {
    navigation: NavigationScreenProp<{}>
    articleData: {}
    headline: string
    image?: string
}) => {
    const { appearance, name: appearanceName } = useArticleAppearance()
    return (
        <SlideCard
            headerStyle={[styles.header, appearance.cardAndPlaque]}
            backgroundColor={appearance.cardAndPlaque.backgroundColor}
            onDismiss={() => {
                navigation.goBack()
            }}
        >
            <View style={styles.container}>
                {appearanceName === 'longread' ? (
                    <LongReadHeader {...{ headline, image }} />
                ) : (
                    <NewsHeader {...{ headline, image }} />
                )}

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
