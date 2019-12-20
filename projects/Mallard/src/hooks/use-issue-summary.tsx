import { Dispatch, SetStateAction } from 'react'
import { PathToIssue } from 'src/paths'
import { IssueSummary } from '../common'
import { fetchAndStoreIssueSummary, readIssueSummary } from '../helpers/files'
import { AppState, AppStateStatus } from 'react-native'
import gql from 'graphql-tag'
import { getSetting } from '../helpers/settings'
import { useQuery } from './apollo'
import ApolloClient from 'apollo-client'

interface IssueSummaryState {
    issueSummary: IssueSummary[] | null
    issueId: PathToIssue | null
    setIssueId: Dispatch<SetStateAction<PathToIssue | null>>
    error: string
}

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

const __typename = 'IssueSummary'

type QueryValue = { issueSummary: IssueSummaryState }
const QUERY = gql`
    {
        issueSummary @client {
            issueSummary @client
            issueId @client
            setIssueId @client
            error @client
        }
    }
`

type InnerQueryValue = {
    maxAvailableEditions: number
    netInfo: { isConnected: boolean }
}
const INNER_QUERY = gql`
    {
        maxAvailableEditions @client
        netInfo @client {
            isConnected @client
        }
    }
`

export const setIssueId = (
    client: ApolloClient<object>,
    newIssueId: PathToIssue,
) => {
    client.writeQuery({
        query: QUERY,
        data: {
            issueSummary: { __typename, issueId: newIssueId },
        },
    })
}

const grabIssueSummary = async (
    client: ApolloClient<object>,
    hasConnected: boolean,
) => {
    let issueSummary: IssueSummary[]
    try {
        issueSummary = await getIssueSummary(hasConnected)
    } catch (error) {
        client.writeQuery({
            query: QUERY,
            data: { issueSummary: { __typename, error } },
        })
        return
    }
    client.writeQuery({
        query: QUERY,
        data: {
            issueSummary: {
                __typename,
                issueSummary,
                error: '',
            },
        },
    })
    return issueSummary
}

export const initIssueSummary = (client: ApolloClient<object>) => {
    let hasConnected = true // assume we are connected to start with

    client.cache.writeQuery({
        query: QUERY,
        data: {
            issueSummary: {
                __typename,
                issueSummary: null,
                issueId: null,
                setIssueId: setIssueId.bind(null, client),
                error: '',
            },
        },
    })

    const grabIssueAndSetLatest = async () => {
        const result = client.readQuery<QueryValue>({ query: QUERY })
        const issueSummary = result && result.issueSummary.issueSummary
        const previousLatest =
            issueSummary && issueSummaryToLatestPath(issueSummary)

        const res = await client.query<InnerQueryValue>({
            query: INNER_QUERY,
        })
        const { isConnected } = res.data.netInfo
        const newIssueSummary = await grabIssueSummary(client, isConnected)
        if (newIssueSummary == null) {
            // now we've foregrounded again, wait for a new issue list
            // seen as we couldn't get one now
            hasConnected = false
            return
        }

        const newLatest = issueSummaryToLatestPath(newIssueSummary)
        // only update to latest issue if there is indeed a new latest issue
        if (
            !previousLatest ||
            (previousLatest.localIssueId !== newLatest.localIssueId &&
                previousLatest.publishedIssueId !== newLatest.publishedIssueId)
        ) {
            setIssueId(client, newLatest)
        }
    }

    // Fetch the initial summary and set the initial issue to be shown
    grabIssueAndSetLatest()

    AppState.addEventListener('change', async (appState: AppStateStatus) => {
        // when we foreground have another go at fetching again
        if (appState === 'active') {
            grabIssueAndSetLatest()
        }
    })

    client
        .watchQuery<InnerQueryValue>({ query: INNER_QUERY })
        .subscribe(async res => {
            const { isConnected } = res.data.netInfo
            if (!hasConnected) {
                hasConnected = isConnected
            }
            grabIssueSummary(client, isConnected)
        })
}

const useIssueSummary = (): IssueSummaryState => {
    const res = useQuery<QueryValue>(QUERY)
    if (res.loading) throw new Error('unavailable issue summary state')
    return res.data.issueSummary
}

export { useIssueSummary, issueSummaryToLatestPath, getIssueSummary }
