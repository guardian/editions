import { AccuWeatherLocation, Forecast } from 'src/common'
import { AppState } from 'react-native'
import ApolloClient from 'apollo-client'

class CannotFetchError extends Error {}

/**
 * Throw strongly typed error on network error, most notably
 * is connection is down. Allows us to process this correctly downstream.
 */
const tryFetch = async (url: string): Promise<Response> => {
    try {
        return await fetch(url)
    } catch (error) {
        throw new CannotFetchError(error.message)
    }
}

const getIpAddress = async (): Promise<string> => {
    const resp = await tryFetch('https://api.ipify.org')
    return await resp.text()
}

const fetchFromWeatherApi = async <T>(path: string): Promise<T> => {
    const res = await tryFetch(`http://mobile-weather.guardianapis.com/${path}`)
    if (res.status >= 500) {
        throw new CannotFetchError('Server returned 500') // 500s don't return json
    }
    return await res.json()
}

const getCurrentLocation = async () => {
    const ip = await getIpAddress()
    return await fetchFromWeatherApi<AccuWeatherLocation>(
        `locations/v1/cities/ipAddress?q=${ip}&details=false`,
    )
}

export type Weather =
    | {
          __typename: 'Weather'
          locationName: string
          isLocationPrecise: boolean
          forecasts: Forecast[]
          lastUpdated: number
          available: true
      }
    | {
          __typename: 'Weather'
          // Apollo forces us to have `null`s instead of missing fields
          locationName: null
          isLocationPrecise: null
          forecasts: null
          lastUpdated: null
          available: false
      }

const UNAVAILABLE_WEATHER: Weather = {
    __typename: 'Weather',
    locationName: null,
    isLocationPrecise: null,
    forecasts: null,
    lastUpdated: null,
    available: false,
}

/**
 * We augment the return object with `__typename` fields to that Apollo can
 * "reconcile" the value when we update the cache later. If the wheater if
 * unavailable we keep the previous data as a `fallback`.
 */
const getWeather = async (fallback?: Weather): Promise<Weather> => {
    try {
        const loc = await getCurrentLocation()
        const forecasts = await fetchFromWeatherApi<Forecast[]>(
            `forecasts/v1/hourly/12hour/${loc.Key}.json?metric=true&language=en-gb`,
        )
        return {
            __typename: 'Weather',
            locationName: loc.EnglishName,
            isLocationPrecise: false,
            forecasts: forecasts.map(forecast => ({
                ...forecast,
                Temperature: {
                    ...forecast.Temperature,
                    __typename: 'Temperature',
                },
                // Sometimes the api doesn't provide these fields but Apollo
                // needs `null`s rather than missing fields.
                PrecipitationType: forecast.PrecipitationType || null,
                PrecipitationIntensity: forecast.PrecipitationIntensity || null,
                __typename: 'Forecast',
            })),
            lastUpdated: Date.now(),
            available: true,
        }
    } catch (error) {
        if (error instanceof CannotFetchError) {
            if (fallback != null) return fallback
            return UNAVAILABLE_WEATHER
        }
        throw error
    }
}

const MS_IN_A_SECOND = 1000
const SECS_IN_A_MINUTE = 60
const MINS_IN_AN_HOUR = 60
const ONE_HOUR = MS_IN_A_SECOND * SECS_IN_A_MINUTE * MINS_IN_AN_HOUR

/**
 * Resolve weather location information and forecasts. Refetch weather
 * after that if app is foregrounded and data is more than an hour old.
 * (We can't use `setTimeout` because of https://github.com/facebook/react-native/issues/12981)
 */
export const resolveWeather = (() => {
    // If `undefined`, weather has never been shown.
    let weather: Promise<Weather> | undefined

    // When going foreground, we get the fresh weather (and potentially new
    // location). Once that resolves we update the cache with the correct value,
    // which updates any view showing the weather.
    const onAppGoesForeground = async (client: ApolloClient<object>) => {
        if (weather == null) return
        let value = await weather
        if (value.available && Date.now() < value.lastUpdated + ONE_HOUR) return
        weather = getWeather(value)
        value = await weather
        client.writeData({ data: { weather: value } })
    }

    // The first time this is called we setup a listener to update the weather
    // from time to time.
    return (
        _context: unknown,
        _args: {},
        { client }: { client: ApolloClient<object> },
    ) => {
        if (weather !== undefined) return weather

        weather = getWeather()
        AppState.addEventListener('change', status => {
            if (status !== 'active') return
            onAppGoesForeground(client)
        })
        return weather
    }
})()
