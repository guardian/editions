import { Forecast, AccuWeatherLocation, WeatherForecast } from '../common'
import { RESULTS } from 'react-native-permissions'
import Geolocation, {
    GeolocationResponse,
} from '@react-native-community/geolocation'

Geolocation.setRNConfiguration({
    /**
     * We want to control the exact moment the permission pop-up shows, so
     * we don't rely on the Geolocation module and instead manage permissions
     * ourselves (see `locationPermissionStatus` Apollo field).
     */
    skipPermissionRequests: true,
    authorizationLevel: 'whenInUse',
})

const getIpAddress = async (): Promise<string> => {
    const resp = await fetch('https://api.ipify.org')
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
    return fetch('http://mobile-weather.guardianapis.com/' + path).then(res => {
        if (res.status >= 500) {
            throw new Error('Failed to fetch') // 500s don't return json
        }
        return res.json()
    })
}

const getForecastsFromLocation = async (location: AccuWeatherLocation) => {
    const forecasts = await fetchFromWeatherApi<Forecast[]>(
        `forecasts/v1/hourly/12hour/${location.Key}.json?metric=true&language=en-gb`,
    )
    const weatherForecast: WeatherForecast = {
        locationName: location.EnglishName,
        forecasts,
    }

    return weatherForecast
}

const getIpBasedWeatherForecast = async (): Promise<WeatherForecast> => {
    const ipAddress = await getIpAddress()
    const location = await fetchFromWeatherApi<AccuWeatherLocation>(
        `locations/v1/cities/ipAddress?q=${ipAddress}&details=false`,
    )
    return getForecastsFromLocation(location)
}

const getLocationBasedWeatherForecast = async (): Promise<WeatherForecast> => {
    const latLong = await getGeolocation()
    const coordsStr = `${latLong.coords.latitude},${latLong.coords.longitude}`
    const location = await fetchFromWeatherApi<AccuWeatherLocation>(
        `locations/v1/cities/geoposition/search?q=${coordsStr}&details=false`,
    )
    return getForecastsFromLocation(location)
}

export const resolveWeatherForecast = async (
    obj: {},
    args: { locationPermissionStatus?: string },
): Promise<WeatherForecast | undefined> => {
    if (args.locationPermissionStatus == null)
        throw new Error('expected argument "locationPermissionStatus"')
    if (args.locationPermissionStatus === RESULTS.GRANTED)
        return await getLocationBasedWeatherForecast()
    return await getIpBasedWeatherForecast()
}
