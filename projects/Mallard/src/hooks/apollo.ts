import { useQuery as useApolloQuery } from '@apollo/react-hooks'
import ApolloClient from 'apollo-client'
import { DocumentNode } from 'graphql'

export enum QueryStatus {
    LOADING,
    LOADED,
}

export type QueryResult<Data> = (
    | { status: QueryStatus.LOADING }
    | { status: QueryStatus.LOADED; data: Data }) & {
    client: ApolloClient<object>
}

/**
 * Light wrapper around Apollo own `useQuery` to directly throw errors (to be
 * caught by the closest exception handler). This allows callsites to have
 * less boilerplate code and is more idiomatic modern React.
 *
 * This also returns a strongly typed object indicating if we're still loading.
 * Once all the data is available, the component re-renders and
 * `useQuery` will return the final data.
 */
export const useQuery = <Data>(query: DocumentNode): QueryResult<Data> => {
    const { loading, error, data, client } = useApolloQuery(query)
    if (error != null) throw error
    if (loading) return { status: QueryStatus.LOADING, client }
    return { status: QueryStatus.LOADED, client, data }
}
