import { ApolloClient } from 'apollo-client'
import { InMemoryCache } from 'apollo-cache-inmemory'
import { HttpLink } from 'apollo-link-http'
import { resolveWeatherVisibility } from 'src/helpers/weather-visibility'

const RESOLVERS = {
    /** `Query` is the root object for any Apollo query(). */
    Query: {
        weatherVisibility: resolveWeatherVisibility,
    },
}

export const createApolloClient = () => {
    const link = new HttpLink({
        uri: 'http://localhost:4000/',
    })
    return new ApolloClient({
        cache: new InMemoryCache(),
        link,
        resolvers: RESOLVERS,
    })
}
