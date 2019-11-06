import { AccuWeatherLocation, Forecast } from 'src/common'
import { AppState } from 'react-native'
import ApolloClient from 'apollo-client'

const getIpAddress = async (): Promise<string> => {
    const resp = await fetch('https://api.ipify.org')
    return await resp.text()
}

const fetchFromWeatherApi = async <T>(path: string): Promise<T> => {
    const res = await fetch(`http://mobile-weather.guardianapis.com/${path}`)
    if (res.status >= 500) {
        throw new Error('Failed to fetch') // 500s don't return json
    }
    return await res.json()
}

const getCurrentLocation = async () => {
    const ip = await getIpAddress()
    return await fetchFromWeatherApi<AccuWeatherLocation>(
        `locations/v1/cities/ipAddress?q=${ip}&details=false`,
    )
}

const getWeather = async () => {
    const loc = await getCurrentLocation()
    const forecasts = await fetchFromWeatherApi<Forecast[]>(
        `forecasts/v1/hourly/12hour/${loc.Key}.json?metric=true&language=en-gb`,
    )
    return {
        __typename: 'Weather',
        locationName: loc.EnglishName,
        forecasts,
    }
}

export type Weather = { locationName: string; forecasts: Forecast[] }
/** Assume weather never changes. */
export const resolveWeather = (() => {
    let lastWeather: { value: Promise<Weather>; ts: number } | undefined

    return (
        _context: unknown,
        _args: unknown,
        { client }: { client: ApolloClient<object> },
    ) => {
        if (lastWeather !== undefined) return lastWeather
        AppState.addEventListener('change', status => {
            if (status !== 'active') return
        })
        return (lastWeather = getWeather())
    }
})()
