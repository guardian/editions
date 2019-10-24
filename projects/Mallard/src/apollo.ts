import { ApolloClient } from 'apollo-client'
import { InMemoryCache } from 'apollo-cache-inmemory'
import { HttpLink } from 'apollo-link-http'
import { resolveWeatherVisibility } from 'src/helpers/weather-visibility'
import { resolveLocationPermissionStatus } from 'src/helpers/location-permission'
import { resolveWeatherForecast } from 'src/helpers/weather-forecast'

const RESOLVERS = {
    /** `Query` is the root object for any Apollo query(). */
    Query: {
        weatherVisibility: resolveWeatherVisibility,
        locationPermissionStatus: resolveLocationPermissionStatus,
        weatherForecast: resolveWeatherForecast,
    },
}

export const createApolloClient = () => {
    const link = new HttpLink({
        /** We never fetch from a server at this point in time */
        uri: '',
    })
    return new ApolloClient({
        cache: new InMemoryCache(),
        link,
        resolvers: RESOLVERS,
    })
}
