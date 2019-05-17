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
    contentContainer: {},
})

const useFrontsData = () => useEndpoint('', [], res => res)

const FrontRow = ({ frontsData, title, issue, front, navigation }) => (
    <>
        <View
            style={{
                padding: metrics.horizontal,
                paddingBottom: 0,
                paddingTop: metrics.vertical * 2,
            }}
        >
            <HeadlineText>{title}</HeadlineText>
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
    </>
)

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
            <FrontRow
                title={'News'}
                {...{ issue, navigation, frontsData, front }}
            />
            <FrontRow
                title={'Sport'}
                {...{ issue, navigation, frontsData, front }}
            />
            <FrontRow
                title={'Other'}
                {...{ issue, navigation, frontsData, front }}
            />
            <MonoTextBlock style={{ flex: 1 }}>
                This is an FrontScreen for from {front}, issue {issue}
            </MonoTextBlock>
        </ScrollView>
    )
}

export { FrontScreen }
