import { resolveWeather } from '../weather'
import { AppState } from 'react-native'

const CITIES_URL =
    'http://mobile-weather.guardianapis.com/locations/v1/cities/ipAddress?q=127.0.0.1&details=false'
const FORECASTS_URL =
    'http://mobile-weather.guardianapis.com/forecasts/v1/hourly/12hour/london.json?metric=true&language=en-gb'
let forecasts = [{ DateTime: '0000' }]
;(global as any).fetch = jest.fn().mockImplementation(async (url: string) => {
    if (url === 'https://api.ipify.org')
        return { text: () => Promise.resolve('127.0.0.1') }
    if (url === CITIES_URL)
        return {
            json: () =>
                Promise.resolve({ Key: 'london', EnglishName: 'London' }),
        }
    if (url === FORECASTS_URL) return { json: () => Promise.resolve(forecasts) }
    throw new Error(`unknown: ${url}`)
})

let now = 100000000
Date.now = () => now

const getExpectedWeather = () => ({
    __typename: 'Weather',
    locationName: 'London',
    isLocationPrecise: false,
    lastUpdated: now,
    available: true,
    forecasts: [
        {
            __typename: 'Forecast',
            DateTime: forecasts[0].DateTime,
            PrecipitationIntensity: null,
            PrecipitationType: null,
            Temperature: { __typename: 'Temperature' },
        },
    ],
})

it('should resolve and update the weather', async () => {
    const client = { writeData: jest.fn() } as any
    let res = await resolveWeather({}, {}, { client })
    expect(res).toEqual(getExpectedWeather())
    expect(fetch).toHaveBeenCalledTimes(3)

    // Second time does no retrigger fetches.
    res = await resolveWeather({}, {}, { client })
    expect(res).toEqual(getExpectedWeather())

    expect(client.writeData).not.toHaveBeenCalled()
    expect(fetch).toHaveBeenCalledTimes(3)

    forecasts = [{ DateTime: '1234' }]
    now += 1000 * 60 * 60 * 3

    expect(AppState.addEventListener).toHaveBeenCalledTimes(1)
    const cb = (AppState.addEventListener as any).mock.calls[0][1]
    await cb('active')

    res = await resolveWeather({}, {}, { client })
    expect(res).toEqual(getExpectedWeather())

    expect(client.writeData).toHaveBeenCalledWith({
        data: { weather: res },
    })
})
