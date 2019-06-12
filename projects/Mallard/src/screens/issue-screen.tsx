import React, { useMemo } from 'react'
import { ScrollView, StyleSheet } from 'react-native'
import { MonoTextBlock } from '../components/styled-text'
import { NavigationScreenProp } from 'react-navigation'

import { container } from '../theme/styles'
import { Front } from '../components/front/front'
import { renderIssueDate } from '../helpers/issues'
import { Issue } from '../common'

const styles = StyleSheet.create({
    container,
    contentContainer: {},
})

const IssueScreen = ({
    navigation,
}: {
    navigation: NavigationScreenProp<{}>
}) => {
    const issue: Issue = navigation.getParam('issue', { date: -1 })
    const issueDate = useMemo(() => renderIssueDate(issue.date), [issue.date])

    return (
        <ScrollView
            style={styles.container}
            contentContainerStyle={styles.contentContainer}
        >
            <MonoTextBlock>
                This is a IssueScreen for issue {issueDate.weekday} -{' '}
                {issueDate.date}
            </MonoTextBlock>

            <Front front="cities" />
            <Front front="best-awards" />
        </ScrollView>
    )
}

export { IssueScreen }
