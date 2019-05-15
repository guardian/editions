import React from 'react'
import { ScrollView, StyleSheet } from 'react-native'
import { MonoTextBlock } from '../components/styled-text'
import { Grid } from '../components/lists/grid'
import { createFluidNavigator } from 'react-navigation-fluid-transitions'
import { ArticleScreen } from './article-screen'
import { useEndpoint } from '../hooks/use-fetch'
import { NavigationScreenProp } from 'react-navigation'

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

const PreFrontScreen = (props: { navigation: NavigationScreenProp<{}> }) => {
    const frontsData = useFrontsData()
    const { navigation } = props
    const issue = navigation.getParam('issue', 'NO-ID')
    const front = navigation.getParam('front', 'NO-ID')
    return (
        <ScrollView
            style={styles.container}
            contentContainerStyle={styles.contentContainer}
        >
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

PreFrontScreen.navigationOptions = () => ({
    navigation: null,
})

const Navigator = createFluidNavigator(
    {
        Home: PreFrontScreen,
        Article: ArticleScreen,
    },
    {
        initialRouteName: 'Home',
        transitionConfig: {
            duration: 300,
        },
    },
)

export class FrontScreen extends React.Component<{
    navigation: NavigationScreenProp<{}>
}> {
    static router = Navigator.router

    render() {
        const { navigation } = this.props
        return <Navigator navigation={navigation} />
    }
}
