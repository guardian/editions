import { AccuWeatherLocation, Forecast } from 'src/common'
import { AppState } from 'react-native'
import Geolocation, {
    GeolocationResponse,
} from '@react-native-community/geolocation'
import { LOCATION_PERMISSION_STATUS_QUERY } from './location-permission'
import { RESULTS } from 'react-native-permissions'
import { Query, QueryEnvironment, LocalResolver } from './queries'

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

export const getGeolocation = async (): Promise<GeolocationResponse> => {
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

const getIpBasedLocation = async () => {
    const ip = await getIpAddress()
    const accuLoc = await fetchFromWeatherApi<AccuWeatherLocation>(
        `locations/v1/cities/ipAddress?q=${ip}&details=false`,
    )
    return { accuLoc, isPrecise: false }
}

const getCurrentLocation = async (resolve: LocalResolver) => {
    const permStatus = await resolve(LOCATION_PERMISSION_STATUS_QUERY, {})
    if (permStatus !== RESULTS.GRANTED) {
        return await getIpBasedLocation()
    }
    let geoloc
    try {
        geoloc = await getGeolocation()
    } catch (error) {
        return await getIpBasedLocation()
    }
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
    resolve: LocalResolver,
    fallback: Weather | undefined,
): Promise<Weather | undefined> => {
    try {
        const { accuLoc, isPrecise } = await getCurrentLocation(resolve)
        const forecasts = await fetchFromWeatherApi<Forecast[]>(
            `forecasts/v1/hourly/12hour/${accuLoc.Key}.json?metric=true&language=en-gb`,
        )
        return makeWeatherObject(accuLoc, isPrecise, forecasts)
    } catch (error) {
        if (!(error instanceof CannotFetchError)) throw error
        if (fallback != null) return fallback
        return undefined
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
export const WEATHER_QUERY = Query.create(
    async (_, resolve, prevValue: Weather | undefined) => {
        console.warn('fetching weather')
        return await getWeather(resolve, prevValue)
    },
)

export const registerLiveWeather = (env: QueryEnvironment) => {
    AppState.addEventListener('change', status => {
        if (status !== 'active') return
        const result = env.peek(WEATHER_QUERY, undefined)
        if (result.value == null) return
        if (Date.now() < result.value.lastUpdated + ONE_HOUR) return
        env.invalidate(WEATHER_QUERY, undefined)
    })
}
