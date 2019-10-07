import React, { createContext, useContext, useState } from 'react'
import { IssueSummary } from '../common'
import { getIssueSummaryNew } from './use-api'
import { CachedOrPromise } from 'src/helpers/fetch/cached-or-promise'
import { useCachedOrPromise } from './use-cached-or-promise'
import { withResponse } from 'src/helpers/response'

const IssueSummaryContext = createContext<CachedOrPromise<IssueSummary[]>>([])

const fetchIssueSummary = () => {
    const response = useCachedOrPromise(getIssueSummaryNew())
    return {
        response: withResponse<IssueSummary[]>(response),
        retry: response.retry,
    }
}

const issueSummaryToLatestPath = (issueSummary: IssueSummary[]) => ({
    localIssueId: issueSummary[0].localId,
    publishedIssueId: issueSummary[0].publishedId,
})

const IssueSummaryProvider = ({ children }: { children: React.ReactNode }) => {
    const [issueId, setIssueId] = useState(null)

    const issueSummary = fetchIssueSummary()

    if (issueId === null && issueSummary.response) {
        console.log(
            issueSummary.response({
                success: issueSummary =>
                    setIssueId(issueSummaryToLatestPath(issueSummary)),
                pending: () => null,
                error: () => null,
            }),
        )
    }

    return (
        <IssueSummaryContext.Provider
            value={{ issueSummary, issueId, setIssueId }}
        >
            {children}
        </IssueSummaryContext.Provider>
    )
}

const useIssueSummaryJames = () => useContext(IssueSummaryContext)

export { IssueSummaryProvider, useIssueSummaryJames, issueSummaryToLatestPath }
