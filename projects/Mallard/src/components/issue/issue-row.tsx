import React, { useMemo, ReactNode } from 'react'
import {
    IssueTitle,
    IssueTitleAppearance,
    GridRowSplit,
} from 'src/components/issue/issue-title'
import { RowWrapper } from '../layout/ui/row'
import { IssueSummary } from 'src/common'
import { renderIssueDate } from 'src/helpers/issues'
import { StyleSheet, StyleProp, ViewStyle, View } from 'react-native'
import { Highlight } from 'src/components/highlight'

interface GridRowSplitPropTypes {
    children: ReactNode
    proxy?: ReactNode
    style?: StyleProp<
        Pick<ViewStyle, 'paddingTop' | 'paddingVertical' | 'paddingBottom'>
    >
}

const rowStyles = StyleSheet.create({
    issueRow: {
        flexGrow: 1,
    },
})

const IssueRow = ({
    issue,
    onPress,
    proxy,
}: {
    issue: IssueSummary
    onPress: () => void
    proxy?: GridRowSplitPropTypes['proxy']
}) => {
    const { date, weekday } = useMemo(() => renderIssueDate(issue.date), [
        issue.date,
    ])

    return (
        <RowWrapper>
            <GridRowSplit {...{ proxy }}>
                <View style={rowStyles.issueRow}>
                    <Highlight onPress={onPress}>
                        <IssueTitle
                            title={weekday}
                            subtitle={date}
                            appearance={IssueTitleAppearance.tertiary}
                        />
                    </Highlight>
                </View>
            </GridRowSplit>
        </RowWrapper>
    )
}

export { IssueRow }
