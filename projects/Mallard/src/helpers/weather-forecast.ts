import { Forecast, AccuWeatherLocation, WeatherForecast } from '../common'
import { RESULTS } from 'react-native-permissions'

const getIpAddress = async (): Promise<string> => {
    const resp = await fetch('https://api.ipify.org')
    return await resp.text()
}

const fetchFromWeatherApi = async <T>(path: string): Promise<T> => {
    return fetch('http://mobile-weather.guardianapis.com/' + path).then(res => {
        if (res.status >= 500) {
            throw new Error('Failed to fetch') // 500s don't return json
        }
        return res.json()
    })
}

export const getIpBasedWeatherForecast = async (): Promise<WeatherForecast> => {
    const ipAddress = await getIpAddress()
    const location = await fetchFromWeatherApi<AccuWeatherLocation>(
        `locations/v1/cities/ipAddress?q=${ipAddress}&details=false`,
    )
    const forecasts = await fetchFromWeatherApi<Forecast[]>(
        `forecasts/v1/hourly/12hour/${location.Key}.json?metric=true&language=en-gb`,
    )
    const weatherForecast: WeatherForecast = {
        locationName: location.EnglishName,
        forecasts,
    }

    return weatherForecast
}

export const resolveWeatherForecast = async (
    obj: {},
    args: { locationPermissionStatus?: string },
): Promise<WeatherForecast | undefined> => {
    if (args.locationPermissionStatus == null) {
        return
    }
    if (args.locationPermissionStatus !== RESULTS.GRANTED) {
        return await getIpBasedWeatherForecast()
    }
    return { locationName: 'hello, world', forecasts: [] }
}
