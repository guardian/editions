import { EditionId, EditionsList, IssueSummary } from '.'
import { defaultRegionalEditions } from './editions-defaults'

export const issueSummaryComparator = (a: IssueSummary, b: IssueSummary) => {
    return a.date.localeCompare(b.date)
}

export const issueSummarySort = (issues: IssueSummary[]): IssueSummary[] => {
    return issues.sort(issueSummaryComparator).reverse()
}

export const getEditionIds = (editionList: EditionsList | null): EditionId[] =>
    editionList
        ? editionList.regionalEditions
              .map((e) => e.edition)
              .concat(editionList.specialEditions.map((e) => e.edition))
        : defaultRegionalEditions.map((e) => e.edition)
