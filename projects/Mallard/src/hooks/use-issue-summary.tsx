import React, {
    createContext,
    useContext,
    useState,
    SetStateAction,
    Dispatch,
} from 'react'
import { IssueSummary } from '../common'
import { CachedOrPromise } from 'src/helpers/fetch/cached-or-promise'
import { useCachedOrPromise } from './use-cached-or-promise'
import { withResponse } from 'src/helpers/response'
import { useNetInfo } from './use-net-info'
import { storeIssueSummary, readIssueSummary } from '../helpers/files'
import { PathToIssue } from 'src/paths'

interface IssueSummaryState {
    issueSummary: any
    issueId: PathToIssue
    setIssueId: Dispatch<SetStateAction<PathToIssue>>
}

const IssueSummaryContext = createContext<IssueSummaryState | null>(null)

const getIssueSummary = (
    isConnected: boolean = true,
): CachedOrPromise<IssueSummary[]> => {
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

const issueSummaryToLatestPath = (
    issueSummary: IssueSummary[],
): PathToIssue => ({
    localIssueId: issueSummary[0].localId,
    publishedIssueId: issueSummary[0].publishedId,
})

const IssueSummaryProvider = ({ children }: { children: React.ReactNode }) => {
    const [issueId, setIssueId] = useState(null)
    const { isConnected } = useNetInfo()

    const issueSummary = fetchIssueSummary(isConnected)

    if (issueId === null && issueSummary.response) {
        issueSummary.response({
            success: (issueSummary: IssueSummary[]) =>
                setIssueId(issueSummaryToLatestPath(issueSummary)),
            pending: () => <></>,
            error: () => <></>,
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

const useIssueSummaryJames = () =>
    useContext<IssueSummaryState>(IssueSummaryContext)

export {
    IssueSummaryProvider,
    useIssueSummaryJames,
    issueSummaryToLatestPath,
    getIssueSummary,
}
