import React from 'react'
import { ScrollView, StyleSheet } from 'react-native'
import { MonoTextBlock } from '../components/styled-text'
import { NavigationScreenProp } from 'react-navigation'

import { container } from '../theme/styles'
import { Front } from '../components/front/front'

const styles = StyleSheet.create({
    container,
    contentContainer: {},
})

const IssueScreen = ({
    navigation,
}: {
    navigation: NavigationScreenProp<{}>
}) => {
    const issue = navigation.getParam('issue', 'NO-ID')
    return (
        <ScrollView
            style={styles.container}
            contentContainerStyle={styles.contentContainer}
        >
            <Front front="cities" />
            <Front front="best-awards" />
            <MonoTextBlock>
                This is a IssueScreen for issue {issue}
            </MonoTextBlock>
        </ScrollView>
    )
}

export { IssueScreen }
