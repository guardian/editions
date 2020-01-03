import * as NetInfo from 'src/hooks/use-net-info'
import { PathToIssue } from 'src/paths'
import { IssueSummary } from '../common'
import { fetchAndStoreIssueSummary, readIssueSummary } from '../helpers/files'
import { AppState, AppStateStatus } from 'react-native'
import gql from 'graphql-tag'
import { getSetting } from '../helpers/settings'
import { useQuery } from './apollo'
import ApolloClient from 'apollo-client'
import { Dispatch } from 'react'

interface IssueSummaryState {
    __typename: 'IssueSummary'
    isFromAPI: boolean
    issueSummary: IssueSummary[] | null
    issueId: PathToIssue | null
    error: string
    setIssueId: Dispatch<PathToIssue>
}

const getIssueSummary = async (isConnected = true): Promise<IssueSummary[]> => {
    const issueSummary = isConnected
        ? await fetchAndStoreIssueSummary()
        : await readIssueSummary()
    const maxAvailableEditions = await getSetting('maxAvailableEditions')
    const trimmedSummary = issueSummary.slice(0, maxAvailableEditions)
    return trimmedSummary
}

const issueSummaryToLatestPath = (issueSummary: IssueSummary[]): PathToIssue =>
    issueSummary && {
        localIssueId: issueSummary[0].localId,
        publishedIssueId: issueSummary[0].publishedId,
    }

const __typename = 'IssueSummary'

type QueryValue = { issueSummary: IssueSummaryState }
const QUERY = gql`
    {
        issueSummary @client {
            isFromAPI @client
            issueSummary @client
            issueId @client
            setIssueId @client
            error @client
        }
    }
`

/**
 * Based on the previous value and current environment conditions (ex. network),
 * fetch a new version of the list of issues and update to the latest issue
 * available if a new one was published.
 */
const refetch = async (
    prevIssueSummary: IssueSummaryState,
): Promise<IssueSummaryState> => {
    // FIXME: `prevIssueSummary.issueSummary` is weird naming. Rename this
    // (however this requires refactoring the places using it).
    const previousLatest =
        prevIssueSummary &&
        prevIssueSummary.issueSummary &&
        issueSummaryToLatestPath(prevIssueSummary.issueSummary)

    const { isConnected } = await NetInfo.fetch()
    let issueSummary: IssueSummary[]
    try {
        issueSummary = await getIssueSummary(isConnected)
    } catch (error) {
        // We do not discard the existing issue summary if there's one, we only
        // append the error in case the UI needs to display it.
        //
        // FIXME: string exceptions in JS are an anti-pattern, as they don't
        // collect stack traces, etc. We should instead forward an `Error`
        // object. Additionally, it is poor practice to just display a message
        // from an error as it could contain technical details that are
        // irrelevant for end users; instead errors should be coded (ex. with
        // numeric error code, each of which has a corresponding UI message).
        return { ...prevIssueSummary, error }
    }

    const newLatest = issueSummaryToLatestPath(issueSummary)
    let issueId = prevIssueSummary && prevIssueSummary.issueId

    // Update to latest issue if there is a new latest issue
    if (
        issueId == null ||
        !previousLatest ||
        (previousLatest.localIssueId !== newLatest.localIssueId &&
            previousLatest.publishedIssueId !== newLatest.publishedIssueId)
    ) {
        issueId = newLatest
    }

    return {
        ...prevIssueSummary,
        isFromAPI: isConnected,
        issueSummary,
        issueId,
        error: '',
    }
}

const EMPTY_ISSUE_SUMMARY: IssueSummaryState = {
    __typename,
    isFromAPI: false,
    issueSummary: null,
    issueId: null,
    error: '',
    setIssueId: () => {},
}

export const createIssueSummaryResolver = () => {
    let result: Promise<IssueSummaryState> | undefined

    /**
     * First time we try to resolve the "issue summary" (the list of issues
     * available, essentially), we register a few event listeners and fetch our
     * first value. If the resolver is called again we always return the same
     * promise. Finally, on particular events, we directly update the Apollo
     * cache to represent the updates.
     */
    return (
        _obj: unknown,
        _vars: unknown,
        { client }: { client: ApolloClient<object> },
    ) => {
        // We're already in the process of fetching or updating the summary, so
        // let's return that.
        if (result != null) return result

        /**
         * This is called whenever we want to update the "issue summary" in response
         * to a change in the environment. For example, we selected "14 days" of
         * issues, or the network is back on, etc. To do so, we first wait on the
         * current update by awaiting `result` (we don't want updates running
         * concurrently and corrupting the state). Then we replace that `result`
         * with our new fetch Promise and finally we update the cache once this
         * resolves.
         *
         * An alternative strategy would be to discard the current update if there
         * is one, but because `reduce` can have side-effects (ex. writing the fetch
         * summary to disk), this would not be safe.
         */
        const update = async (
            reducer: (_: IssueSummaryState) => Promise<IssueSummaryState>,
        ) => {
            if (result == null) return
            const prevIssueSummary = await result
            result = reducer(prevIssueSummary)
            const issueSummary = await result
            client.writeQuery({ query: QUERY, data: { issueSummary } })
        }

        const refetchUpdate = update.bind(null, refetch)

        // Otherwise we register our callbacks:
        //
        // 1. When we connect and the summary we already have isn't from API,
        //    fetch a fresh one.
        NetInfo.addEventListener(async ({ isConnected }) => {
            const issueSummary = await result
            if (issueSummary && !issueSummary.isFromAPI && isConnected)
                refetchUpdate()
        })

        // 2. When we foreground, just always refresh the summary (note: we
        //    might want to consider refreshing only if the data is older than X
        //    minutes).
        AppState.addEventListener(
            'change',
            async (appState: AppStateStatus) => {
                if (appState === 'active') refetchUpdate()
            },
        )

        // 3. If the number of editions we need to display changed (ex. user
        //    selected "14 days" when they used to have only 7 days), then fetch
        //    a new list of editions as well.
        {
            type QueryValue = { maxAvailableEditions: number }
            const query = gql('{maxAvailableEditions @client}')
            client.watchQuery<QueryValue>({ query }).subscribe(refetchUpdate)
        }

        /**
         * Enqueue an update that simply set a new issue ID, no fetch happening.
         * This can be called when selecting a new issue in the UI.
         */
        const setIssueId = (issueId: PathToIssue) => {
            update(async prevIssueSummary => ({
                ...prevIssueSummary,
                issueId,
            }))
        }

        // Finally, grab the initial value for the issue summary and return it.
        return (result = refetch({ ...EMPTY_ISSUE_SUMMARY, setIssueId }))
    }
}

/**
 * Avoid using this function if you can consolidate it into another query
 * instead.
 */
const useIssueSummary = (): IssueSummaryState => {
    const res = useQuery<QueryValue>(QUERY)
    // FIXME: this is poor practice as this causes UI to render with empty data
    // instead of correctly handling the "loading" state.
    if (res.loading) return EMPTY_ISSUE_SUMMARY
    return res.data.issueSummary
}

export { useIssueSummary, issueSummaryToLatestPath, getIssueSummary }
