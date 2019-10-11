import NetInfo from '@react-native-community/netinfo'
import React, {
    createContext,
    Dispatch,
    SetStateAction,
    useContext,
    useEffect,
    useRef,
    useState,
} from 'react'
import { PathToIssue } from 'src/paths'
import { IssueSummary } from '../common'
import { fetchAndStoreIssueSummary, readIssueSummary } from '../helpers/files'
import { AppState } from 'react-native'

interface IssueSummaryState {
    issueSummary: IssueSummary[] | null
    issueId: PathToIssue | null
    setIssueId: Dispatch<SetStateAction<PathToIssue | null>>
    error: string
}

const IssueSummaryContext = createContext<IssueSummaryState>({
    issueSummary: null,
    issueId: null,
    setIssueId: () => {},
    error: '',
})

const getIssueSummary = (isConnected = true): Promise<IssueSummary[]> =>
    isConnected ? fetchAndStoreIssueSummary() : readIssueSummary()

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
    const hasConnected = useRef(false)

    const grabIssueSummary = (isConnected: boolean) => {
        getIssueSummary(isConnected)
            .then((issueSummary: IssueSummary[]) => {
                setIssueSummary(issueSummary)
                setIssueId(issueSummaryToLatestPath(issueSummary))
                setError('')
            })
            .catch(e => {
                setError(e.message)
            })
    }

    useEffect(() => {
        NetInfo.addEventListener(({ isConnected }) => {
            if (!hasConnected.current) {
                hasConnected.current = isConnected

                grabIssueSummary(isConnected)
            }

            AppState.addEventListener('change', appState => {
                if (appState === 'active') {
                    grabIssueSummary(isConnected)
                }
            })
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
