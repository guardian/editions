import { getSetting, storeSetting } from './settings'
import { ApolloClient } from 'apollo-client'
import { useQuery } from '@apollo/react-hooks'
import gql from 'graphql-tag'

type WeatherVisibility = 'shown' | 'hidden'

/** Weather is shown by default */
export const resolveWeatherVisibility = async () => {
    const value = await getSetting('weatherVisibility')
    return value || 'shown'
}

/** Can be refactored later as a generic Setting mutator */
export const setWeatherVisibility = (
    apolloClient: ApolloClient<object>,
    visibility: WeatherVisibility,
) => {
    storeSetting('weatherVisibility', visibility)
    apolloClient.writeData({
        data: {
            weatherVisibility: visibility,
        },
    })
}

export const toggleWeatherVisibility = (
    client: ApolloClient<object>,
    value: WeatherVisibility,
) => {
    setWeatherVisibility(client, value === 'shown' ? 'hidden' : 'shown')
}

const QUERY = gql`
    {
        weatherVisibility @client
    }
`

export const useWeatherVisibility = () => {
    const { data, error, loading, client } = useQuery(QUERY)
    return { value: data && data.weatherVisibility, error, loading, client }
}
