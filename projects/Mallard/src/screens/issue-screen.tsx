import React, { useMemo, useState } from 'react'
import { ScrollView, StyleSheet } from 'react-native'
import { NavigationScreenProp, NavigationEvents } from 'react-navigation'

import { container } from '../theme/styles'
import { Front } from '../components/front'
import { renderIssueDate } from '../helpers/issues'
import { Issue } from '../common'
import { Header } from '../components/header'

const styles = StyleSheet.create({
    container,
    contentContainer: {},
})

export const IssueScreen = ({
    navigation,
}: {
    navigation: NavigationScreenProp<{}>
}) => {
    const issue: Issue = navigation.getParam('issue', { date: -1 })
    const { weekday, date } = useMemo(() => renderIssueDate(issue.date), [
        issue.date,
    ])

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
            <Header title={weekday} subtitle={date} />

            <Front
                {...{ viewIsTransitioning }}
                issue={issue.name}
                front="best-awards"
            />
            <Front
                {...{ viewIsTransitioning }}
                issue={issue.name}
                front="local-asdf"
            />
            <Front
                {...{ viewIsTransitioning }}
                issue={issue.name}
                front="cities"
            />
        </ScrollView>
    )
}
