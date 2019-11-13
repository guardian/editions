/**
 * Setup Apollo framework. At the moment we use Apollo Local State management
 * mechanism and don't fetch data from GraphQL endpoints.
 */
import { ApolloClient } from 'apollo-client'
import { InMemoryCache } from 'apollo-cache-inmemory'
import { SETTINGS_RESOLVERS } from './helpers/settings/resolvers'
import { resolveWeather } from './helpers/weather'
import { resolveLocationPermissionStatus } from './helpers/location-permission'

/**
 * Resolvers is what Apollo uses to get the value of field that has never been
 * cached before. For example if you have a query `{ foo @client }`, Apollo
 * looks for the field `foo` at the root of the cache. If not available, it'll
 * look for the resolver `Query.foo` (`Query` is just the "namespace" where
 * all queries start).
 *  *
 * Resolvers are functions, which can be asynchonous. They can gather data from
 * local storage (ex. settings), from local APIs (ex. permissions, geolocation),
 * from remote APIs (ex. REST API).
 *
 * Once a resolver returns a value, Apollo will refresh automatically
 * any component that was requiring this in a query via the `useQuery` function.
 */
const RESOLVERS = {
    Query: {
        ...SETTINGS_RESOLVERS,
        weather: resolveWeather,
        locationPermissionStatus: resolveLocationPermissionStatus,
    },
}

/**
 * The `Link` is the interface Apollo uses to reach GraphQL servers. Since we
 * don't fetch anything from GraphQL endpoints at the moment, we use a no-op
 * `Link` object. We *must* throw to prevent bad queries from carrying through.
 *
 * Apollo would try to use the `Link` if you have a query such as `{ foo }`
 * without the `@client` annotation. In our current use case, `@client` always
 * needs to be specified.
 */
const link = {
    split: () => {
        throw new Error('Not implemented. Did you forget to use `@client`?')
    },
    concat: () => {
        throw new Error('not implemented Did you forget to use `@client`?')
    },
    request: () => {
        throw new Error('not implemented Did you forget to use `@client`?')
    },
}

export const createApolloClient = () =>
    new ApolloClient({
        cache: new InMemoryCache(),
        link,
        resolvers: RESOLVERS,
    })
