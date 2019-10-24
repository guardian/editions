import gql from 'graphql-tag'
import { ApolloClient } from 'apollo-client'

const GET_LOCATION_PERMISSION = gql`
    {
        locationPermissionStatus @client
    }
`

export const resolveWeatherForecast = async (
    _obj: {},
    args: {},
    { client }: { client: ApolloClient<object> },
) => {
    const result = await client.query({ query: GET_LOCATION_PERMISSION })
    return ''
}
