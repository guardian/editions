import React, { useMemo } from 'react'
import {
    IssueTitle,
    IssueTitleAppearance,
    GridRowSplit,
} from 'src/components/issue'
import { RowWrapper, RowWrapperProps } from './row'
import { IssueSummary } from 'src/common'
import { renderIssueDate } from 'src/helpers/issues'

const IssueRow = ({
    issue,
    onPress,
}: { issue: IssueSummary } & RowWrapperProps) => {
    const { date, weekday } = useMemo(() => renderIssueDate(issue.date), [
        issue.date,
    ])

    return (
        <RowWrapper onPress={onPress}>
            <GridRowSplit>
                <IssueTitle
                    title={date}
                    subtitle={weekday}
                    appearance={IssueTitleAppearance.ocean}
                />
            </GridRowSplit>
        </RowWrapper>
    )
}

export { IssueRow }
