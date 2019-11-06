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

/**
 * We augment the return object with `__typename` fields to that Apollo can
 * "reconcile" the value when we update the cache later.
 */
const getWeather = async () => {
    const loc = await getCurrentLocation()
    const forecasts = await fetchFromWeatherApi<Forecast[]>(
        `forecasts/v1/hourly/12hour/${loc.Key}.json?metric=true&language=en-gb`,
    )
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
    }
}

const MS_IN_A_SECOND = 1000
const SECS_IN_A_MINUTE = 60
const MINS_IN_AN_HOUR = 60
const ONE_HOUR = MS_IN_A_SECOND * SECS_IN_A_MINUTE * MINS_IN_AN_HOUR

export type Weather = { locationName: string; forecasts: Forecast[] }
type WeatherUpdate = { value: Promise<Weather>; lastUpdated: number }

/**
 * Resolve weather location information and forecasts. Refetch weather
 * after that if app is foregrounded and data is more than an hour old.
 * (We can't use `setTimeout` because of https://github.com/facebook/react-native/issues/12981)
 */
export const resolveWeather = (() => {
    // If `undefined`, weather has never been shown.
    let weather: WeatherUpdate | undefined

    const getUpdate = () => {
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
