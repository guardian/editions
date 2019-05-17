import React from 'react'
import { ScrollView, View, StyleSheet } from 'react-native'
import { MonoTextBlock, HeadlineText } from '../components/styled-text'
import { Grid } from '../components/lists/grid'
import { useEndpoint } from '../hooks/use-fetch'
import { NavigationScreenProp } from 'react-navigation'
import { metrics } from '../theme/spacing'

const styles = StyleSheet.create({
    container: {
        flex: 1,
        backgroundColor: '#fff',
    },
    contentContainer: {
        flex: 1,
        alignItems: 'stretch',
    },
})

const useFrontsData = () => useEndpoint('', [], res => res)

const FrontScreen = (props: { navigation: NavigationScreenProp<{}> }) => {
    const frontsData = useFrontsData()
    const { navigation } = props
    const issue = navigation.getParam('issue', 'NO-ID')
    const front = navigation.getParam('front', 'NO-ID')
    return (
        <ScrollView
            style={styles.container}
            contentContainerStyle={styles.contentContainer}
        >
            <View
                style={{
                    padding: metrics.horizontal,
                    paddingBottom: 0,
                    paddingTop: metrics.vertical * 2,
                }}
            >
                <HeadlineText>News</HeadlineText>
            </View>
            <Grid
                onPress={item => navigation.navigate('Article', item)}
                data={frontsData.map(([title]: any[], index: number) => ({
                    issue,
                    front,
                    article: index,
                    key: index.toString(),
                    title,
                    headline: title,
                }))}
            />
            <MonoTextBlock style={{ flex: 1 }}>
                This is an FrontScreen for from {front}, issue {issue}
            </MonoTextBlock>
        </ScrollView>
    )
}

export { FrontScreen }
