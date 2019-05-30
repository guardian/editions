import React, { useState } from 'react'
import { useEndpoint } from '../hooks/use-fetch'
import { NavigationScreenProp } from 'react-navigation'
import {
    WithArticleAppearance,
    ArticleAppearance,
    articleAppearances,
} from '../theme/appearance'
import { Article } from '../components/article'
import { Button, View } from 'react-native'

const fixture = (seed: number): { image: string | null } => ({
    image: [
        'https://media.guim.co.uk/1d046fd12d5685eacd943fcf2089f23ecc873e8b/0_224_6720_4032/1000.jpg',
        'https://i.guim.co.uk/img/media/aa751497cada64b193f8f3e640a3261eb0e16e81/424_255_4518_2711/master/4518.jpg?width=860&quality=45&auto=format&fit=max&dpr=2&s=5025f6e75a0cbb9a7cdecf948f1a54af',
        null,
    ][seed % 3],
})

const useArticleData = (articleId, { headline }) => {
    return useEndpoint('', [headline, [[]]], res => res[articleId])
}

export const ArticleScreen = ({
    navigation,
}: {
    navigation: NavigationScreenProp<{}>
}) => {
    const articleFromUrl = navigation.getParam('article', -1)
    const headlineFromUrl = navigation.getParam(
        'headline',
        'HEADLINE NOT FOUND',
    )
    const [headline, [article]] = useArticleData(articleFromUrl, {
        headline: headlineFromUrl,
    })
    const { image } = fixture(articleFromUrl)
    const appearances = Object.keys(articleAppearances)
    const [appearance, setAppearance] = useState(0)
    return (
        <>
            <View
                style={{
                    backgroundColor: 'tomato',
                    position: 'absolute',
                    bottom: 100,
                    zIndex: 9999,
                }}
            >
                <Button
                    title={`Cycle appearances: [${appearances[appearance]}]`}
                    onPress={() => {
                        setAppearance(app => {
                            if (app + 1 >= appearances.length) {
                                return 0
                            }
                            return app + 1
                        })
                    }}
                />
            </View>
            <WithArticleAppearance value={appearances[appearance]}>
                <Article
                    article={article}
                    kicker={'Kicker'}
                    headline={headline}
                    image={image}
                    navigation={navigation}
                />
            </WithArticleAppearance>
        </>
    )
}

ArticleScreen.navigationOptions = ({ navigation }) => ({
    title: navigation.getParam('article', 'NO-ID'),
})
