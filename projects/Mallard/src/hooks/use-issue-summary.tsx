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
import { getSetting } from '../helpers/settings'

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

const getIssueSummary = async (isConnected = true): Promise<IssueSummary[]> => {
    const issueSummary = isConnected
        ? await fetchAndStoreIssueSummary()
        : await readIssueSummary()
    const maxAvailableEditions = await getSetting('maxAvailableEditions')
    const trimmedSummary = issueSummary.slice(0, maxAvailableEditions)
    return trimmedSummary
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
    const hasConnected = useRef<boolean>(true) // assume we are connected to start with
    const { data } = useQuery(
        gql`
            {
                maxAvailableEditions @client
            }
        `,
    )

    const maxAvailableEditions = data && data.maxAvailableEditions

    const grabIssueSummary = (hasConnected: boolean) =>
        getIssueSummary(hasConnected)
            .then((issueSummary: IssueSummary[]) => {
                setIssueSummary(issueSummary)
                setError('')
                return issueSummary
            })
            .catch(e => {
                setError(e.message)
            })

    useEffect(() => {
        const grabIssueAndSetLatest = async () => {
            const previousLatest =
                issueSummary && issueSummaryToLatestPath(issueSummary)

            const { isConnected } = await NetInfo.fetch()
            const newIssueSummary = await grabIssueSummary(isConnected)
            if (newIssueSummary == null) {
                // now we've foregrounded again, wait for a new issue list
                // seen as we couldn't get one now
                hasConnected.current = false
                return
            }

            const newLatest = issueSummaryToLatestPath(newIssueSummary)
            // only update to latest issue if there is indeed a new latest issue
            if (
                !previousLatest ||
                (previousLatest.localIssueId !== newLatest.localIssueId &&
                    previousLatest.publishedIssueId !==
                        newLatest.publishedIssueId)
            ) {
                setIssueId(newLatest)
            }
        }

        // On mount there is no issueId, so set it to latest
        if (!issueId) {
            grabIssueAndSetLatest()
        }

        const unsubNet = NetInfo.addEventListener(({ isConnected }) => {
            // try and get a fresh summary until we made it to online
            if (!hasConnected.current) {
                hasConnected.current = isConnected

                grabIssueSummary(isConnected)
            }
        })

        const appStateChangeListener = async (appState: AppStateStatus) => {
            // when we foreground have another go at fetching again
            if (appState === 'active') {
                grabIssueAndSetLatest()
            }
        }

        AppState.addEventListener('change', appStateChangeListener)

        return () => {
            unsubNet()
            AppState.removeEventListener('change', appStateChangeListener)
        }
    }, [issueId, maxAvailableEditions, issueSummary])

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
