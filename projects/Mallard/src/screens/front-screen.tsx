import React, { useState, useRef, FunctionComponent } from 'react'
import {
    ScrollView,
    View,
    StyleSheet,
    Dimensions,
    Animated,
} from 'react-native'
import { MonoTextBlock } from '../components/styled-text'
import { useEndpoint } from '../hooks/use-fetch'
import { NavigationScreenProp } from 'react-navigation'
import { metrics } from '../theme/spacing'
import { container } from '../theme/styles'
import { FrontCardGroup } from '../components/front/front-card-group'
import { FrontsData } from '../helpers/types'
import { Navigator } from '../components/navigator'
import { color } from '../theme/color'
import { ArticleAppearance } from '../theme/appearance'
import { FrontRow } from '../components/front/front'

interface AnimatedScrollViewRef {
    _component: ScrollView
}

const styles = StyleSheet.create({
    container,
    contentContainer: {},
})

const useFrontsData = () => useEndpoint('', [], res => res)

/* 
Map the position of the tap on the screen to 
the position of the tap on the scrubber itself (which has padding). 
This is coupled to the visual layout and we can be a bit more 
clever but also for now this works 
*/
const getScrollPos = (screenX: number) => {
    const { width } = Dimensions.get('window')
    return screenX + (metrics.horizontal * 6 * screenX) / width
}

const getNearestPage = (screenX: number, pageCount: number) => {
    const { width } = Dimensions.get('window')
    return Math.round((getScrollPos(screenX) * (pageCount - 1)) / width)
}

const getTranslateForPage = (scrollX: Animated.Value, page: number) => {
    const { width } = Dimensions.get('window')
    return scrollX.interpolate({
        inputRange: [width * (page - 1), width * page, width * (page + 1)],
        outputRange: [metrics.horizontal * -1.5, 0, metrics.horizontal * 1.5],
    })
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
            <FrontRow front="cities" />
            <MonoTextBlock style={{ flex: 1 }}>
                This is a FrontScreen for issue {issue}
            </MonoTextBlock>
        </ScrollView>
    )
}

export { FrontScreen }
