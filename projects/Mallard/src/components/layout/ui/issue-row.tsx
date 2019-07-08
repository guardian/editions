import React, { useMemo, ReactNode } from 'react'
import { Title, TitleAppearance } from 'src/components/header/title'
import { RowWrapper, RowWrapperProps } from './row'
import { IssueSummary } from 'src/common'
import { renderIssueDate } from 'src/helpers/issues'
import { View, StyleSheet } from 'react-native'
import { metrics } from 'src/theme/spacing'

const splitStyles = StyleSheet.create({
    container: { flexDirection: 'row', justifyContent: 'flex-end' },
    inner: {
        flexDirection: 'row',
        justifyContent: 'space-around',
    },
})

const IssueSplit = ({ children }: { children: ReactNode }) => {
    const maxWidth = metrics.issueHeaderSplit()
    return (
        <View style={splitStyles.container}>
            <View style={[splitStyles.inner, { width: maxWidth }]}>
                {children}
            </View>
        </View>
    )
}

const IssueRow = ({
    issue,
    onPress,
}: { issue: IssueSummary } & RowWrapperProps) => {
    const { date, weekday } = useMemo(
        () => renderIssueDate(issue.date * 1000),
        [issue.date],
    )

    return (
        <RowWrapper onPress={onPress}>
            <IssueSplit>
                <Title
                    title={date}
                    subtitle={weekday}
                    appearance={TitleAppearance.ocean}
                />
            </IssueSplit>
        </RowWrapper>
    )
}

export { IssueRow, IssueSplit }
