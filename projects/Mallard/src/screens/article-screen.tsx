import React from 'react'
import { View, Text, StyleSheet, Button, Platform } from 'react-native'
import { HeadlineText } from '../components/styled-text'
import { useEndpoint } from '../hooks/use-fetch'
import { NavigationScreenProp } from 'react-navigation'
import { color } from '../theme/color'
import { metrics } from '../theme/spacing'
import { SlideCard } from '../components/layout/slide-card'

const notchInsetSize = Platform.OS === 'ios' ? 50 : 0
const styles = StyleSheet.create({
    container: {
        marginTop: notchInsetSize,
        borderTopLeftRadius: 10,
        borderTopRightRadius: 10,
        overflow: 'hidden',
        flex: 2,
    },
    card: {
        flexShrink: 0,
        alignItems: 'flex-start',
        padding: metrics.horizontal,
        paddingVertical: metrics.vertical / 2,
        backgroundColor: color.palette.lifestyle.faded,
        borderColor: color.line,
        borderBottomWidth: 1,
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
        <SlideCard
            onDismiss={() => {
                navigation.goBack()
            }}
        >
            <View style={styles.container}>
                <View style={styles.card}>
                    <Button
                        onPress={() => {
                            navigation.goBack()
                        }}
                        title={'👈 Backsies'}
                    />
                    <HeadlineText
                        style={{
                            color: color.palette.lifestyle.main,
                        }}
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
