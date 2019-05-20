import React from 'react'
import { ScrollView, View, StyleSheet } from 'react-native'
import { MonoTextBlock, HeadlineText } from '../components/styled-text'
import { Grid } from '../components/lists/grid'
import { useEndpoint } from '../hooks/use-fetch'
import { NavigationScreenProp } from 'react-navigation'
import { metrics } from '../theme/spacing'
import { container } from '../theme/styles'
const styles = StyleSheet.create({
    container,
    contentContainer: {},
})

const useFrontsData = () => useEndpoint('', [], res => res)

const FrontRow = ({ frontsData, front, issue, navigation }) => (
    <>
        <View
            style={{
                padding: metrics.horizontal,
                paddingBottom: 0,
                paddingTop: metrics.vertical * 2,
            }}
        >
            <HeadlineText>{front}</HeadlineText>
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

const FrontScreen = ({
    navigation,
}: {
    navigation: NavigationScreenProp<{}>
}) => {
    const frontsData = useFrontsData()
    const issue = navigation.getParam('issue', 'NO-ID')
    return (
        <ScrollView
            style={styles.container}
            contentContainerStyle={styles.contentContainer}
        >
            <FrontRow front={'News'} {...{ issue, navigation, frontsData }} />
            <FrontRow front={'Sport'} {...{ issue, navigation, frontsData }} />
            <FrontRow front={'Other'} {...{ issue, navigation, frontsData }} />
            <MonoTextBlock style={{ flex: 1 }}>
                This is an FrontScreen for issue {issue}
            </MonoTextBlock>
        </ScrollView>
    )
}

export { FrontScreen }
