import React, { useMemo } from 'react'
import {
    IssueTitle,
    IssueTitleAppearance,
    IssueRowSplit,
} from 'src/components/issue'
import { RowWrapper, RowWrapperProps } from './row'
import { IssueSummary } from 'src/common'
import { renderIssueDate } from 'src/helpers/issues'

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
            <IssueRowSplit>
                <IssueTitle
                    title={date}
                    subtitle={weekday}
                    appearance={IssueTitleAppearance.ocean}
                />
            </IssueRowSplit>
        </RowWrapper>
    )
}

export { IssueRow }
