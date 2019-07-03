import { useCachedOrPromise } from './use-cached-or-promise'
import { fetchFromApi } from 'src/helpers/fetch'
import { issueSummaryPath, IssueSummary, Issue } from 'src/common'
import { withResponse } from 'src/helpers/response'
import {
    createCachedOrPromise,
    asPromise,
    isNotCached,
} from 'src/helpers/fetch/cached-or-promise'
import { getIssueResponse } from './use-issue'

export const getIssueSummary = () =>
    fetchFromApi<IssueSummary[]>(issueSummaryPath(), {
        cached: true,
        validator: res => res.length > 0,
    })

export const useIssueSummary = () =>
    withResponse<IssueSummary[]>(useCachedOrPromise(getIssueSummary()))

export const getLatestIssue = () => {
    return createCachedOrPromise<Issue>(
        [
            (() => {
                const summary = getIssueSummary()
                if (!isNotCached(summary)) {
                    const issue = getIssueResponse(
                        summary.value[summary.value.length - 1].key,
                    )
                    if (!isNotCached(issue)) {
                        return issue.value
                    }
                }
            })(),
            async () => {
                const resp = await asPromise(getIssueSummary())
                const issue = getIssueResponse(resp[resp.length - 1].key)
                return asPromise(issue)
            },
        ],
        {
            savePromiseResultToValue: () => null,
        },
    )
}
export const useLatestIssue = () =>
    withResponse<Issue>(useCachedOrPromise(getLatestIssue()))
