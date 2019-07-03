import { useCachedOrPromise } from './use-cached-or-promise'
import { fetchFromApi } from 'src/helpers/fetch'
import { issueSummaryPath, IssueSummary, Issue } from 'src/common'
import { withResponse } from 'src/helpers/response'
import { chain } from 'src/helpers/fetch/cached-or-promise'
import { getIssueResponse } from './use-issue'

export const getIssueSummary = () =>
    fetchFromApi<IssueSummary[]>(issueSummaryPath(), {
        cached: true,
        validator: res => res.length > 0,
    })

export const useIssueSummary = () =>
    withResponse<IssueSummary[]>(useCachedOrPromise(getIssueSummary()))

export const getLatestIssue = () => {
    return chain<IssueSummary[], Issue>(getIssueSummary(), summary =>
        getIssueResponse(summary[summary.length - 1].key),
    )
}
export const useLatestIssue = () =>
    withResponse<Issue>(useCachedOrPromise(getLatestIssue()))
