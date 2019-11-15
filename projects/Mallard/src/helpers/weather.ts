import { AccuWeatherLocation, Forecast } from 'src/common'
import { AppState } from 'react-native'
import ApolloClient from 'apollo-client'
import Geolocation, {
    GeolocationResponse,
} from '@react-native-community/geolocation'
import { resolveLocationPermissionStatus } from './location-permission'
import { RESULTS } from 'react-native-permissions'

class CannotFetchError extends Error {}

Geolocation.setRNConfiguration({
    /**
     * We want to control the exact moment the permission pop-up shows, so
     * we don't rely on the Geolocation module and instead manage permissions
     * ourselves (see `locationPermissionStatus` Apollo field).
     */
    skipPermissionRequests: true,
    authorizationLevel: 'whenInUse',
})

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

const getGeolocation = async (): Promise<GeolocationResponse> => {
    return new Promise((resolve, reject) => {
        Geolocation.getCurrentPosition(
            resolve,
            error => reject(new Error(error.message)),
            { enableHighAccuracy: false },
        )
    })
}

const fetchFromWeatherApi = async <T>(path: string): Promise<T> => {
    const res = await tryFetch(`http://mobile-weather.guardianapis.com/${path}`)
    if (res.status >= 500) {
        throw new CannotFetchError('Server returned 500') // 500s don't return json
    }
    return await res.json()
}

const getCurrentLocation = async () => {
    const permStatus = await resolveLocationPermissionStatus()
    if (permStatus !== RESULTS.GRANTED) {
        const ip = await getIpAddress()
        const accuLoc = await fetchFromWeatherApi<AccuWeatherLocation>(
            `locations/v1/cities/ipAddress?q=${ip}&details=false`,
        )
        return { accuLoc, isPrecise: false }
    }
    const geoloc = await getGeolocation()
    const latLong = `${geoloc.coords.latitude},${geoloc.coords.longitude}`
    const accuLoc = await fetchFromWeatherApi<AccuWeatherLocation>(
        `locations/v1/cities/geoposition/search?q=${latLong}&details=false`,
    )
    return { accuLoc, isPrecise: true }
}

export type Weather = {
    __typename: 'Weather'
    locationName: string
    isLocationPrecise: boolean
    forecasts: Forecast[]
    lastUpdated: number
}

const makeWeatherObject = (
    accuLoc: AccuWeatherLocation,
    isPrecise: boolean,
    forecasts: Forecast[],
): Weather => ({
    __typename: 'Weather',
    locationName: accuLoc.EnglishName,
    isLocationPrecise: isPrecise,
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
})

/**
 * We augment the return object with `__typename` fields to that Apollo can
 * "reconcile" the value when we update the cache later. If the wheater if
 * unavailable we keep the previous data as a `fallback`.
 */
const getWeather = async (
    fallback: Weather | null,
): Promise<Weather | null> => {
    try {
        const { accuLoc, isPrecise } = await getCurrentLocation()
        const forecasts = await fetchFromWeatherApi<Forecast[]>(
            `forecasts/v1/hourly/12hour/${accuLoc.Key}.json?metric=true&language=en-gb`,
        )
        return makeWeatherObject(accuLoc, isPrecise, forecasts)
    } catch (error) {
        if (!(error instanceof CannotFetchError)) throw error
        if (fallback != null) return fallback
        return null
    }
}

const MS_IN_A_SECOND = 1000
const SECS_IN_A_MINUTE = 60
const MINS_IN_AN_HOUR = 60
const ONE_HOUR = MS_IN_A_SECOND * SECS_IN_A_MINUTE * MINS_IN_AN_HOUR

/**
 * Resolve weather location information and forecasts. Refetch weather
 * after that if app is foregrounded and data is more than an hour old.
 * (We can't use `setTimeout` because of
 * https://github.com/facebook/react-native/issues/12981)
 *
 * `refreshWeather` forces an immediate refresh, can be from user request or
 * when the location permission change and we can now fetch more
 * precise weather.
 */
const { resolveWeather, refreshWeather } = (() => {
    // If `undefined`, weather has never been shown.
    let weather: Promise<Weather | null> | undefined

    // We update the cache only if no other update happened in-between.
    const update = async (
        client: ApolloClient<object>,
        fallback: Weather | null,
    ) => {
        if (weather == null) return
        const newWeather = (weather = getWeather(fallback))
        const value = await weather
        // `weather` might have changed while we were awaiting, in which case
        // we don't want to update the cache with stale data.
        if (weather == newWeather)
            client.writeData({ data: { weather: value } })
    }

    // When going foreground, we get the fresh weather (and potentially new
    // location). Once that resolves we update the cache with the correct value,
    // which updates any view showing the weather.
    const onAppGoesForeground = async (client: ApolloClient<object>) => {
        if (weather == null) return
        const value = await weather
        if (value != null && Date.now() < value.lastUpdated + ONE_HOUR) return
        update(client, value)
    }

    // The first time this is called we setup a listener to update the weather
    // from time to time.
    const resolveWeather = (
        _context: unknown,
        _args: {},
        { client }: { client: ApolloClient<object> },
    ) => {
        if (weather !== undefined) return weather

        weather = getWeather(null)
        AppState.addEventListener('change', status => {
            if (status !== 'active') return
            onAppGoesForeground(client)
        })
        return weather
    }

    const refreshWeather = async (client: ApolloClient<object>) => {
        if (weather == null) return
        client.writeData({ data: { weather: null } })
        await update(client, null)
    }

    return { resolveWeather, refreshWeather }
})()

export { resolveWeather, refreshWeather }
