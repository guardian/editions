import { IssueSummary } from '.'

export const issueSummaryComparator = (a: IssueSummary, b: IssueSummary) => {
    return a.date.localeCompare(b.date)
}

export const issueSummarySort = (issues: IssueSummary[]): IssueSummary[] => {
    return issues.sort(issueSummaryComparator).reverse()
}
