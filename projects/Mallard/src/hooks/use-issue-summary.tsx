import React, {
    createContext,
    useContext,
    useState,
    SetStateAction,
    Dispatch,
    useEffect,
} from 'react'
import { IssueSummary } from '../common'
import { CachedOrPromise } from 'src/helpers/fetch/cached-or-promise'
import { useCachedOrPromise } from './use-cached-or-promise'
import { withResponse } from 'src/helpers/response'
import { useNetInfo } from './use-net-info'
import { fetchAndStoreIssueSummary, readIssueSummary } from '../helpers/files'
import { PathToIssue } from 'src/paths'
import NetInfo from '@react-native-community/netinfo'

interface IssueSummaryState {
    issueSummary: IssueSummary[] | null
    issueId: PathToIssue | null
    setIssueId: Dispatch<SetStateAction<PathToIssue>>
    error: string
}

const IssueSummaryContext = createContext<IssueSummaryState | null>(null)

const getIssueSummary = (
    isConnected: boolean = true,
): CachedOrPromise<IssueSummary[]> => {
    return {
        type: 'promise',
        getValue: isConnected ? fetchAndStoreIssueSummary : readIssueSummary,
    }
}

const issueSummaryToLatestPath = (
    issueSummary: IssueSummary[],
): PathToIssue => ({
    localIssueId: issueSummary[0].localId,
    publishedIssueId: issueSummary[0].publishedId,
})

const IssueSummaryProvider = ({ children }: { children: React.ReactNode }) => {
    const [issueId, setIssueId] = useState<PathToIssue | null>(null)
    const [issueSummary, setIssueSummary] = useState<IssueSummary[] | null>(
        null,
    )
    const [error, setError] = useState<string>('')
    const [isConnectedInitial, setIsConnectedInitial] = useState(false)
    const { isConnected } = useNetInfo()

    // Run the first time, either offline or online
    useEffect(() => {
        setIsConnectedInitial(isConnected)
        getIssueSummary(isConnected)
            .getValue()
            .then(issueSummary => {
                if (issueSummary) {
                    setIssueSummary(issueSummary)
                    setIssueId(issueSummaryToLatestPath(issueSummary))
                    setError('')
                } else {
                    setError('initial offline')
                }
            })
            .catch(e => {
                setError(e.message)
            })
    }, [])

    useEffect(() => {
        NetInfo.addEventListener(info => {
            // intially offline, but then online
            if (isConnectedInitial === false && info.isConnected === true) {
                getIssueSummary(info.isConnected)
                    .getValue()
                    .then(issueSummary => {
                        setIssueSummary(issueSummary)
                        setIssueId(issueSummaryToLatestPath(issueSummary))
                        setError('')
                    })
                    .catch(e => {
                        setError(e.message)
                    })
            }
        })
    }, [])

    return (
        <IssueSummaryContext.Provider
            value={{ issueSummary, issueId, setIssueId, error }}
        >
            {children}
        </IssueSummaryContext.Provider>
    )
}

const useIssueSummary = () => useContext<IssueSummaryState>(IssueSummaryContext)

export {
    IssueSummaryProvider,
    useIssueSummary,
    issueSummaryToLatestPath,
    getIssueSummary,
}
