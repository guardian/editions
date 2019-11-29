import * as NetInfo from 'src/hooks/use-net-info'
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
import { useQuery } from '@apollo/react-hooks'
import { AppState, AppStateStatus } from 'react-native'
import gql from 'graphql-tag'

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

const getIssueSummary = (
    pageSize: number,
    isConnected = true,
): Promise<IssueSummary[]> =>
    isConnected ? fetchAndStoreIssueSummary(pageSize) : readIssueSummary()

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
    const hasConnected = useRef<boolean>(true) // assume we are connected to start with
    const { data } = useQuery(
        gql`
            {
                maxAvailableEditions @client
            }
        `,
    )

    const grabIssueSummary = (pageSize: number, hasConnected: boolean) => {
        getIssueSummary(pageSize, hasConnected)
            .then((issueSummary: IssueSummary[]) => {
                setIssueSummary(issueSummary)
                setIssueId(issueSummaryToLatestPath(issueSummary))
                setError('')
            })
            .catch(e => {
                setError(e.message)
            })
    }

    const maxAvailableEditions = data && data.maxAvailableEditions

    // fetch on first mount and leave the other useEffect to handle updates
    useEffect(() => {
        if (data) {
            grabIssueSummary(data.maxAvailableEditions, hasConnected.current)
        }
        // eslint-disable-next-line react-hooks/exhaustive-deps
    }, [data])

    useEffect(() => {
        const changeListener = async (appState: AppStateStatus) => {
            // if we're foregrounding, try and re-fetch if we're online
            // don't use `hasConnected` as we may now not be online
            // despite having been online
            if (appState === 'active') {
                const { isConnected } = await NetInfo.fetch()
                if (isConnected) {
                    grabIssueSummary(data.maxAvailableEditions, isConnected)
                } else {
                    // now we've foregrounded again, wait for a new issue list
                    // seen as we couldn't get one now
                    // this will trigger `grabIssueSummary` in the below event
                    // listener
                    hasConnected.current = false
                }
            }
        }

        const unsubNet = NetInfo.addEventListener(state => {
            // if moving online then re-fetch
            if (!hasConnected.current && state.isConnected) {
                hasConnected.current = true
                grabIssueSummary(data.maxAvailableEditions, true)
            }
        })

        AppState.addEventListener('change', changeListener)

        return () => {
            unsubNet()
            AppState.removeEventListener('change', changeListener)
        }
    }, [data, maxAvailableEditions])

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
