import React, { createContext, useContext, useState } from 'react'
import { IssueSummary } from '../common'
import { CachedOrPromise } from 'src/helpers/fetch/cached-or-promise'
import { useCachedOrPromise } from './use-cached-or-promise'
import { withResponse } from 'src/helpers/response'
import { useNetInfo } from './use-net-info'
import { storeIssueSummary, readIssueSummary } from '../helpers/files'

const IssueSummaryContext = createContext<CachedOrPromise<IssueSummary[]>>([])

const getIssueSummary = (isConnected: boolean) => {
    return {
        type: 'promise',
        getValue: isConnected ? storeIssueSummary : readIssueSummary,
    }
}

const fetchIssueSummary = (isConnected: boolean) => {
    const response = useCachedOrPromise(getIssueSummary(isConnected))
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
    const { isConnected } = useNetInfo()

    const issueSummary = fetchIssueSummary(isConnected)

    if (issueId === null && issueSummary.response) {
        issueSummary.response({
            success: issueSummary =>
                setIssueId(issueSummaryToLatestPath(issueSummary)),
            pending: () => null,
            error: () => null,
        })
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

export {
    IssueSummaryProvider,
    useIssueSummaryJames,
    issueSummaryToLatestPath,
    getIssueSummary,
}
