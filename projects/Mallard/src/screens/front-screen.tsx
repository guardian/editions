import React from 'react'
import { ScrollView, View, StyleSheet, Dimensions } from 'react-native'
import { MonoTextBlock } from '../components/styled-text'
import { useEndpoint } from '../hooks/use-fetch'
import { NavigationScreenProp } from 'react-navigation'
import { metrics } from '../theme/spacing'
import { container } from '../theme/styles'
import { NavigatorStrip } from '../components/navigator-strip'
import { FrontPage } from '../components/front/front-page'
import { FrontsData } from '../helpers/types'

const styles = StyleSheet.create({
    container,
    contentContainer: {},
})

const useFrontsData = () => useEndpoint('', [], res => res)

const FrontRow: React.FC<{
    frontsData: FrontsData
    front: any
    issue: any
    navigation: any
}> = ({ frontsData, front, issue, navigation }) => {
    const { width, height: windowHeight } = Dimensions.get('window')
    const height = windowHeight - 300 //TODO: viewport height - padding - slider
    return (
        <>
            <View
                style={{
                    padding: metrics.horizontal,
                    paddingBottom: 0,
                    paddingTop: metrics.vertical * 2,
                }}
            >
                <NavigatorStrip title={front} />
            </View>
            <ScrollView horizontal={true} pagingEnabled>
                <View style={{ width }}>
                    <FrontPage
                        appearance={'comment'}
                        stories={frontsData}
                        length={2}
                        style={{ height }}
                    />
                </View>
                <View style={{ width }}>
                    <FrontPage
                        appearance={'sport'}
                        stories={frontsData}
                        length={3}
                        style={{ height }}
                    />
                </View>
                <View style={{ width }}>
                    <FrontPage
                        appearance={'news'}
                        stories={frontsData}
                        length={4}
                        style={{ height }}
                    />
                </View>
            </ScrollView>
        </>
    )
}

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
            <FrontRow
                front={'Opinion'}
                {...{ issue, navigation, frontsData }}
            />
            <MonoTextBlock style={{ flex: 1 }}>
                This is a FrontScreen for issue {issue}
            </MonoTextBlock>
        </ScrollView>
    )
}

export { FrontScreen }
