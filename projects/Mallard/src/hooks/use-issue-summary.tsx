import React, { createContext, useContext, useReducer } from 'react'
import { useNetInfo } from './use-net-info'
import { IssueSummary } from '../common'
import { getIssueSummary } from './use-api'
import { CachedOrPromise } from 'src/helpers/fetch/cached-or-promise'
import { useCachedOrPromise } from './use-cached-or-promise'
import { withResponse } from 'src/helpers/response'

const IssueSummaryContext = createContext<CachedOrPromise<IssueSummary[]>>([])

const modifyIssueSummary = () => {
    const response = useCachedOrPromise(getIssueSummary())
    return {
        response: withResponse<IssueSummary[]>(response),
        retry: response.retry,
    }
}

const IssueSummaryProvider = ({ children }: { children: React.ReactNode }) => (
    <IssueSummaryContext.Provider value={modifyIssueSummary()}>
        {children}
    </IssueSummaryContext.Provider>
)

const useIssueSummaryJames = () => useContext(IssueSummaryContext)

export { IssueSummaryProvider, useIssueSummaryJames }
