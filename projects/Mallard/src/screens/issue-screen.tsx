import React, { useMemo, useState } from 'react'
import { ScrollView, StyleSheet } from 'react-native'
import { MonoTextBlock } from '../components/styled-text'
import { NavigationScreenProp, NavigationEvents } from 'react-navigation'

import { container } from '../theme/styles'
import { Front } from '../components/front'
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

    /* 
    we don't wanna render a massive tree at once 
    as the navigator is trying to push the screen bc this
    delays the tap response 

    we can pass this prop to identify if we wanna render 
    just the 'above the fold' content or the whole shebang
    */
    const [viewIsTransitioning, setViewIsTransitioning] = useState(true)

    return (
        <ScrollView
            style={styles.container}
            contentContainerStyle={styles.contentContainer}
        >
            <NavigationEvents
                onDidFocus={() => {
                    setViewIsTransitioning(false)
                }}
            />
            <MonoTextBlock>
                This is a IssueScreen for issue {issueDate.weekday} -{' '}
                {issueDate.date}
            </MonoTextBlock>

            <Front {...{ viewIsTransitioning }} front="cities" />
            <Front {...{ viewIsTransitioning }} front="best-awards" />
        </ScrollView>
    )
}

export { IssueScreen }
