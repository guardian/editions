const CITIES_URL =
    'http://mobile-weather.guardianapis.com/locations/v1/cities/ipAddress?q=127.0.0.1&details=false'
const FORECASTS_URL =
    'http://mobile-weather.guardianapis.com/forecasts/v1/hourly/12hour/london.json?metric=true&language=en-gb'
const GEOLOC_URL =
    'http://mobile-weather.guardianapis.com/locations/v1/cities/geoposition/search?q=12,34&details=false'

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
    if (url === GEOLOC_URL)
        return {
            json: () =>
                Promise.resolve({
                    Key: 'london',
                    EnglishName: 'Kings Cross',
                }),
        }
    console.error(`unknown url: ${url}`)
    throw new Error(`unknown url`)
})

jest.mock('react-native-permissions', () => {
    return {
        RESULTS: { GRANTED: 1, DENIED: 2 },
        PERMISSIONS: {
            IOS: { LOCATION_WHEN_IN_USE: 1 },
            ANDROID: { ACCESS_FINE_LOCATION: 1 },
        },
        check: jest.fn().mockResolvedValue(2),
    }
})

jest.mock('@react-native-community/geolocation', () => ({
    setRNConfiguration: () => {},
    getCurrentPosition: (resolve: any) =>
        Promise.resolve().then(() => {
            resolve({
                coords: { latitude: 12, longitude: 34 },
            })
        }),
}))

let now = 100000000
Date.now = () => now

const getExpectedWeather = () => ({
    __typename: 'Weather',
    locationName: 'London',
    isLocationPrecise: false,
    lastUpdated: now,
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

let resolveWeather: any, refreshWeather: any
let AppState: any
let check: any, RESULTS: any

beforeEach(() => {
    jest.resetModules()
    ;({ resolveWeather, refreshWeather } = require('../weather'))
    ;({ AppState } = require('react-native'))
    ;({ check, RESULTS } = require('react-native-permissions'))
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

it('should refresh the weather completely', async () => {
    const client = { writeData: jest.fn() } as any
    await resolveWeather({}, {}, { client })

    forecasts = [{ DateTime: '1234' }]
    const refreshPromise = refreshWeather(client)

    expect(client.writeData).toHaveBeenCalledTimes(1)
    expect(client.writeData).toHaveBeenCalledWith({
        data: {
            weather: null,
        },
    })

    await refreshPromise

    expect(client.writeData).toHaveBeenCalledTimes(2)
    expect(client.writeData).toHaveBeenCalledWith({
        data: { weather: getExpectedWeather() },
    })
})

it('should fetch real location if available', async () => {
    check.mockResolvedValue(RESULTS.GRANTED)

    const client = { writeData: jest.fn() } as any
    const res = await resolveWeather({}, {}, { client })
    expect(res).toEqual({
        ...getExpectedWeather(),
        isLocationPrecise: true,
        locationName: 'Kings Cross',
    })
})

// make it a valid ES6 module
export {}
