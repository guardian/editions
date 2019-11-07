import { AccuWeatherLocation, Forecast } from 'src/common'
import { AppState } from 'react-native'
import ApolloClient from 'apollo-client'

/**
 * Return `null` on network error, most notably is connection is down.
 */
const tryFetch = async (url: string): Promise<Response | null> => {
    try {
        return await fetch(url)
    } catch (error) {
        return null
    }
}

const getIpAddress = async (): Promise<string | null> => {
    const resp = await tryFetch('https://api.ipify.org')
    if (resp == null) return null
    return await resp.text()
}

const fetchFromWeatherApi = async <T>(path: string): Promise<T | null> => {
    const res = await tryFetch(`http://mobile-weather.guardianapis.com/${path}`)
    if (res == null) return null
    if (res.status >= 500) {
        throw new Error('Failed to fetch') // 500s don't return json
    }
    return await res.json()
}

const getCurrentLocation = async () => {
    const ip = await getIpAddress()
    if (ip == null) return null
    return await fetchFromWeatherApi<AccuWeatherLocation>(
        `locations/v1/cities/ipAddress?q=${ip}&details=false`,
    )
}

const UNAVAILABLE_WEATHER: Weather = {
    __typename: 'Weather',
    locationName: '',
    forecasts: [],
    available: false,
}

/**
 * We augment the return object with `__typename` fields to that Apollo can
 * "reconcile" the value when we update the cache later.
 */
const getWeather = async (): Promise<Weather> => {
    const loc = await getCurrentLocation()
    if (loc == null) return UNAVAILABLE_WEATHER
    const forecasts = await fetchFromWeatherApi<Forecast[]>(
        `forecasts/v1/hourly/12hour/${loc.Key}.json?metric=true&language=en-gb`,
    )
    if (forecasts == null) return UNAVAILABLE_WEATHER
    return {
        __typename: 'Weather',
        locationName: loc.EnglishName,
        forecasts: forecasts.map(forecast => ({
            ...forecast,
            Temperature: {
                ...forecast.Temperature,
                __typename: 'Temperature',
            },
            __typename: 'Forecast',
        })),
        available: true,
    }
}

const MS_IN_A_SECOND = 1000
const SECS_IN_A_MINUTE = 60
const MINS_IN_AN_HOUR = 60
const ONE_HOUR = MS_IN_A_SECOND * SECS_IN_A_MINUTE * MINS_IN_AN_HOUR

export type Weather = {
    __typename: 'Weather'
    locationName: string
    forecasts: Forecast[]
    available: boolean
}
type WeatherUpdate = { value: Promise<Weather>; lastUpdated: number }

/**
 * Resolve weather location information and forecasts. Refetch weather
 * after that if app is foregrounded and data is more than an hour old.
 * (We can't use `setTimeout` because of https://github.com/facebook/react-native/issues/12981)
 */
export const resolveWeather = (() => {
    // If `undefined`, weather has never been shown.
    let weather: WeatherUpdate | undefined

    const getUpdate = (): WeatherUpdate => {
        return { value: getWeather(), lastUpdated: Date.now() }
    }

    // When going foreground, we get the fresh weather (and potentially new
    // location). Once that resolves we update the cache with the correct value,
    // which updates any view showing the weather.
    const onAppGoesForeground = (client: ApolloClient<object>) => {
        if (weather == null) return
        if (Date.now() < weather.lastUpdated + ONE_HOUR) return
        weather = getUpdate()
        weather.value.then(weather => {
            client.writeData({ data: { weather } })
        })
    }

    // The first time this is called we setup a listener to update the weather
    // from time to time.
    return (
        _context: unknown,
        _args: {},
        { client }: { client: ApolloClient<object> },
    ) => {
        if (weather !== undefined) return weather.value

        weather = getUpdate()
        AppState.addEventListener('change', status => {
            if (status !== 'active') return
            onAppGoesForeground(client)
        })
        return weather.value
    }
})()
