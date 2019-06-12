import React, { useState } from 'react'
import { useEndpoint } from '../hooks/use-fetch'
import { NavigationScreenProp } from 'react-navigation'
import {
    WithArticleAppearance,
    ArticleAppearance,
    articleAppearances,
} from '../theme/appearance'
import { Article } from '../components/article'
import { Article as ArticleType, ArticleFundamentals } from '../common'
import { View, TouchableOpacity, Text } from 'react-native'
import { metrics } from '../theme/spacing'
import { UiBodyCopy } from '../components/styled-text'
import { withResponse } from '../hooks/use-response'

const useArticleData = (path: string) => {
    return useEndpoint<ArticleType>(`content/${path}`)
}

export const ArticleScreen = ({
    navigation,
}: {
    navigation: NavigationScreenProp<{}>
}) => {
    const pathFromUrl = navigation.getParam('path', '')
    const titleFromUrl = navigation.getParam('title', 'Loading')
    const [appearance, setAppearance] = useState(0)
    const appearances = Object.keys(articleAppearances)
    const article = useArticleData(pathFromUrl)

    return withResponse(article, {
        error: () => <Text>😭</Text>,
        pending: () => (
            <Article
                kicker={'Kicker 🥾'}
                headline={titleFromUrl}
                byline={'Byliney McPerson'}
                standfirst={`Is this delicious smoky dip the ultimate aubergine recipe – and which side of the great tahini divide are you on?`}
            />
        ),
        success: ({ title, imageURL, elements }) => {
            return (
                <>
                    <View
                        style={{
                            backgroundColor: 'tomato',
                            position: 'absolute',
                            zIndex: 9999,
                            elevation: 999,
                            bottom: 100,
                            right: metrics.horizontal,
                            alignSelf: 'flex-end',
                            borderRadius: 999,
                        }}
                    >
                        <TouchableOpacity
                            onPress={() => {
                                setAppearance(app => {
                                    if (app + 1 >= appearances.length) {
                                        return 0
                                    }
                                    return app + 1
                                })
                            }}
                        >
                            <UiBodyCopy
                                style={{
                                    padding: metrics.horizontal * 2,
                                    paddingVertical: metrics.vertical / 1.5,
                                    color: '#fff',
                                }}
                            >
                                {`${appearances[appearance]} 🌈`}
                            </UiBodyCopy>
                        </TouchableOpacity>
                    </View>
                    <WithArticleAppearance
                        value={appearances[appearance] as ArticleAppearance}
                    >
                        <Article
                            article={elements}
                            kicker={'Kicker 🥾'}
                            headline={title}
                            byline={'Byliney McPerson'}
                            standfirst={`Is this delicious smoky dip the ultimate aubergine recipe – and which side of the great tahini divide are you on?`}
                            image={imageURL}
                        />
                    </WithArticleAppearance>
                </>
            )
        },
    })
}

ArticleScreen.navigationOptions = ({
    navigation,
}: {
    navigation: NavigationScreenProp<{}>
}) => ({
    title: navigation.getParam('title', 'Loading'),
    gesturesEnabled: true,
    gestureResponseDistance: {
        vertical: metrics.headerHeight + metrics.slideCardSpacing,
    },
})
