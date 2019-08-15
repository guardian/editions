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

export const useIssueSummary = () => {
    const response = useCachedOrPromise(getIssueSummary())
    return {
        response: withResponse<IssueSummary[]>(response),
        retry: response.retry,
    }
}

export const getLatestIssue = () => {
    console.log("GET LATEST ISSUE")
    return chain<IssueSummary[], Issue>(getIssueSummary(), summary =>
        getIssueResponse(summary[0].key),
    )
}
export const useLatestIssue = () =>
    withResponse<Issue>(useCachedOrPromise(getLatestIssue()))
