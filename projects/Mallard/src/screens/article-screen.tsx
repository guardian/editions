import React, { useState } from 'react'
import { useEndpointResponse } from '../hooks/use-fetch'
import { Error } from '../hooks/use-response'
import { NavigationScreenProp } from 'react-navigation'
import {
    WithArticleAppearance,
    ArticleAppearance,
    articleAppearances,
} from '../theme/appearance'
import { Article } from '../components/article'
import { Article as ArticleType } from '../common'
import { View, TouchableOpacity, Text, Button } from 'react-native'
import { metrics } from '../theme/spacing'
import { UiBodyCopy } from '../components/styled-text'
import { FlexCenter } from '../components/layout/flex-center'

const useArticleResponse = (path: string) =>
    useEndpointResponse<ArticleType>(
        `content/${path}`,
        article => article.title != null,
    )

export const ArticleScreen = ({
    navigation,
}: {
    navigation: NavigationScreenProp<{}>
}) => {
    const pathFromUrl = navigation.getParam('path', '')
    const titleFromUrl = navigation.getParam('title', 'Loading')
    const [appearance, setAppearance] = useState(0)
    const appearances = Object.keys(articleAppearances)
    const articleResponse = useArticleResponse(pathFromUrl)
    const error = ({ message }: Error) => (
        <FlexCenter style={{ backgroundColor: 'tomato' }}>
            <Text style={{ fontSize: 40 }}>😭</Text>
            <UiBodyCopy weight="bold">{message}</UiBodyCopy>
            <Button
                title={'go back'}
                onPress={() => {
                    navigation.goBack()
                }}
            />
        </FlexCenter>
    )
    const pending = () => (
        <Article
            kicker={'Kicker 🥾'}
            headline={titleFromUrl}
            byline={'Byliney McPerson'}
            standfirst={`Is this delicious smoky dip the ultimate aubergine recipe – and which side of the great tahini divide are you on?`}
        />
    )
    const success = ({ title, imageURL, elements }: ArticleType) => {
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
    }

    return articleResponse({
        error,
        pending,
        success,
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
