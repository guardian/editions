import React, { useState, useEffect } from 'react'
import { View, Text, StyleSheet, ScrollView } from 'react-native'
import { MonoTextBlock, HeadlineText } from '../components/styled-text'
import { Transition } from 'react-navigation-fluid-transitions'
import { NavigationScreenProp } from 'react-navigation'
import { color } from '../theme/color'
import { metrics } from '../theme/spacing'

const styles = StyleSheet.create({
    container: {
        color: '#fff',
    },
    headline: {
        flex: 1,
        alignItems: 'flex-start',
        padding: metrics.horizontal,
        paddingVertical: metrics.vertical,
        backgroundColor: color.palette.highlight.main,
    },
    block: {
        alignItems: 'flex-start',
        padding: metrics.horizontal,
        paddingVertical: metrics.vertical,
    },
})

const useArticleData = () => {
    const [articleData, updateArticleData] = useState(['Dummy headline', [[]]])
    useEffect(() => {
        fetch('http://localhost:3131').then(res =>
            res.json().then(res => {
                updateArticleData(res[0])
            }),
        )

        return () => {}
    }, [])

    return articleData
}

export const ArticleScreen = ({
    navigation,
}: {
    navigation: NavigationScreenProp<{}>
}) => {
    const issue = navigation.getParam('issue', 'NO-ID')
    const front = navigation.getParam('front', 'NO-ID')
    const article = navigation.getParam('article', 'NO-ID')
    const [headline, [articleData]] = useArticleData()

    return (
        <ScrollView>
            <View style={styles.container}>
                <Transition shared={`item-${article}`}>
                    <View style={styles.headline}>
                        <HeadlineText>{headline}</HeadlineText>
                    </View>
                </Transition>
                {articleData
                    .filter(el => el.type === 0)
                    .map((el, index) => (
                        <View style={styles.block} key={index}>
                            <Text>{el.textTypeData.html}</Text>
                        </View>
                    ))}
            </View>
        </ScrollView>
    )
}

ArticleScreen.navigationOptions = ({ navigation }) => ({
    title: navigation.getParam('article', 'NO-ID'),
})
