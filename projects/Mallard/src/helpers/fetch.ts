import { Platform } from 'react-native'
import { withCache } from './fetch/cache'
import { getSetting } from './settings'
import {
    REQUEST_INVALID_RESPONSE_VALIDATION,
    LOCAL_JSON_INVALID_RESPONSE_VALIDATION,
} from './words'
import {
    CachedOrPromise,
    createCachedOrPromise,
} from './fetch/cached-or-promise'
import { getJson, isIssueOnDevice, deleteIssueFiles } from './files'
import { Issue } from 'src/common'
import { defaultSettings } from './settings/defaults'
import { cacheClearCache } from './storage'
import { Forecast, AccuWeatherLocation, WeatherForecast } from '../common'

export type ValidatorFn<T> = (response: any | T) => boolean

const fetchFromApiSlow = async <T>(
    path: string,
    {
        validator = () => true,
    }: {
        validator?: ValidatorFn<T>
    } = {},
): Promise<T> => {
    const apiUrl = await getSetting('apiUrl')
    const url = apiUrl + path
    return fetch(url)
        .then(res => {
            if (res.status >= 500) {
                throw new Error('Failed to fetch') // 500s don't return json
            }
            return res.json()
        })
        .then(data => {
            if (data && validator(data)) {
                return data
            } else {
                throw new Error(REQUEST_INVALID_RESPONSE_VALIDATION)
            }
        })
        .catch(err => {
            throw new Error(`${err.message} @ [${apiUrl + path}]`)
        })
}

const fetchFromFileSystemSlow = <T>(
    path: string,
    {
        validator = () => true,
    }: {
        validator?: ValidatorFn<T>
    } = {},
): Promise<T> =>
    getJson(path).then(data => {
        if (data && validator(data)) {
            return data
        } else {
            throw new Error(LOCAL_JSON_INVALID_RESPONSE_VALIDATION)
        }
    })

/*
Use these! They'll default to caching if possible.

These fetchers assume a clean split between the app's
api (sign in, issue list. maybe cachable maybe not)
and the issue files (always cachable, identical
across zip file & issue API)
*/
const fetchFromApi = <T>(
    endpointPath: string,
    {
        validator,
        cached = true,
    }: {
        validator?: ValidatorFn<T>
        cached?: boolean
    } = {},
): CachedOrPromise<T> => {
    const { retrieve, store, clear } = withCache<T>('api')
    if (!cached) {
        clear(endpointPath)
        return createCachedOrPromise(
            [
                null,
                () =>
                    fetchFromApiSlow<T>(endpointPath, {
                        validator,
                    }),
            ],
            {
                savePromiseResultToValue: () => {},
            },
        )
    }
    return createCachedOrPromise(
        [
            retrieve(endpointPath),
            () =>
                fetchFromApiSlow<T>(endpointPath, {
                    validator,
                }),
        ],
        {
            savePromiseResultToValue: result => {
                store(endpointPath, result)
            },
        },
    )
}

const fetchFromIssue = <T>(
    localIssueId: Issue['localId'],
    fsPath: string,
    endpointPath: string,
    { validator }: { validator?: ValidatorFn<T> } = {},
): CachedOrPromise<T> => {
    /*
    retrieve any cached value if we have any
    TODO: invalidate/background refresh these values
    */
    const { retrieve, store } = withCache<T>('issue')
    return createCachedOrPromise(
        [
            retrieve(endpointPath),
            async () => {
                const issueOnDevice = await isIssueOnDevice(localIssueId)
                if (issueOnDevice) {
                    return fetchFromFileSystemSlow<T>(fsPath, {
                        validator,
                    })
                } else {
                    return fetchFromApiSlow<T>(endpointPath, {
                        validator,
                    })
                }
            },
        ],
        {
            savePromiseResultToValue: result => {
                store(endpointPath, result)
            },
        },
    )
}

const fetchFromWeatherApi = async <T>(
    path: string,
    {
        validator = () => true,
    }: {
        validator?: ValidatorFn<T>
    } = {},
): Promise<T> => {
    return fetch('http://mobile-weather.guardianapis.com/' + path)
        .then(res => {
            if (res.status >= 500) {
                throw new Error('Failed to fetch') // 500s don't return json
            }
            return res.json()
        })
        .then(data => {
            if (data && validator(data)) {
                return data
            } else {
                throw new Error(REQUEST_INVALID_RESPONSE_VALIDATION)
            }
        })
}

const fetchAndStoreIpAddress = async (): Promise<string> => {
    const { store: storeIp } = withCache<string>('ipAddress')
    const resp = await fetch('https://api.ipify.org')
    const ipAddress = await resp.text()
    storeIp('ipAddress', ipAddress)
    return ipAddress
}

const fetchIpAddress = (): Promise<string> => {
    const { retrieve: retrieveIp } = withCache<string>('ipAddress')

    const ipAddressFromCache = retrieveIp('ipAddress')

    if (ipAddressFromCache) {
        return Promise.resolve(ipAddressFromCache)
    } else {
        return fetchAndStoreIpAddress()
    }
}

const fetchWeatherForecastForLocation = (): CachedOrPromise<
    WeatherForecast
> => {
    const {
        retrieve: retrieveWeatherLocation,
        store: storeWeatherLocation,
    } = withCache<AccuWeatherLocation>('weatherLocation')
    const {
        retrieve: retrieveWeatherForecast,
        store: storeWeatherForecast,
    } = withCache<Forecast[]>('weatherForecasts')
    const {
        retrieve: retrieveWeatherForecastSummary,
        store: storeWeatherForecastSummary,
    } = withCache<WeatherForecast>('weatherForecastSummary')

    const weatherForecast: Promise<WeatherForecast> = fetchIpAddress().then(
        async ip => {
            const location = await createCachedOrPromise<AccuWeatherLocation>(
                [
                    retrieveWeatherLocation(
                        `locations/v1/cities/ipAddress?q=${ip}&details=false`,
                    ),
                    async () => {
                        return fetchFromWeatherApi<AccuWeatherLocation>(
                            `locations/v1/cities/ipAddress?q=${ip}&details=false`,
                        )
                    },
                ],
                {
                    savePromiseResultToValue: locationResult =>
                        storeWeatherLocation(
                            `locations/v1/cities/ipAddress?q=${ip}&details=false`,
                            locationResult,
                        ),
                },
            ).getValue()

            const forecasts = await createCachedOrPromise(
                [
                    retrieveWeatherForecast(
                        `forecasts/v1/hourly/12hour/${location.Key}.json?metric=true&language=en-gb`,
                    ),
                    async () => {
                        return fetchFromWeatherApi<Forecast[]>(
                            `forecasts/v1/hourly/12hour/${location.Key}.json?metric=true&language=en-gb`,
                        )
                    },
                ],
                {
                    savePromiseResultToValue: forecastsResult =>
                        storeWeatherForecast(
                            `forecasts/v1/hourly/12hour/${location.Key}.json?metric=true&language=en-gb`,
                            forecastsResult,
                        ),
                },
            ).getValue()

            const weatherForecast: WeatherForecast = {
                locationName: location.EnglishName,
                forecasts,
            }

            return weatherForecast
        },
    )

    return createCachedOrPromise(
        [
            retrieveWeatherForecastSummary(`forecasts`),
            async () => weatherForecast,
        ],
        {
            savePromiseResultToValue: result =>
                storeWeatherForecastSummary(`forecasts`, result),
        },
    )
}

const fetchDeprecationWarning = async (): Promise<{
    android: string
    ios: string
}> => {
    const response = await fetch(defaultSettings.deprecationWarningUrl)
    return response.json()
}

const getCacheNumber = async (): Promise<{ cacheClear: string }> => {
    const response = await fetch(defaultSettings.cacheClearUrl)
    return response.json()
}

const fetchCacheClear = async (): Promise<boolean> => {
    try {
        const [cacheNumber, cacheNumberStorage] = await Promise.all([
            getCacheNumber(),
            cacheClearCache.get(),
        ])

        if (cacheNumberStorage === null) {
            // No data, so store it
            await cacheClearCache.set(cacheNumber.cacheClear)
            // Suggests that this is a new user, so carry on as normal
            return true
        }

        if (cacheNumberStorage !== cacheNumber.cacheClear) {
            // Deletes downloaded issues and the cache clear - login and GDPR settings need to be kept
            await deleteIssueFiles()
            await cacheClearCache.reset()
            // Server number doesnt match, which means we are making an attempt to clear the cache.
            return false
        }

        // Cached number matches Remote number, so carry on as normal
        return true
    } catch (e) {
        // Problems? Lets carry on with what we are doing.
        return true
    }
}

const fetchFromNotificationService = async (deviceToken: { token: string }) => {
    const registerDeviceUrl = await getSetting('notificationServiceRegister')
    const { token } = deviceToken
    const options = {
        deviceToken: token,
        platform: Platform.OS === 'ios' ? 'ios-edition' : 'android-edition',
        topics: [
            {
                name: 'uk',
                type: 'editions',
            },
        ],
    }
    return fetch(registerDeviceUrl as string, {
        method: 'post',
        body: JSON.stringify(options),
        headers: {
            'Content-Type': 'application/json',
        },
    }).then(response =>
        response.ok
            ? Promise.resolve(response.json())
            : Promise.reject(response.status),
    )
}

const fetchIssueSummary = async () => {
    const apiUrl = await getSetting('apiUrl')
    return fetch(`${apiUrl}/issues`, {
        method: 'get',
        headers: {
            'Content-Type': 'application/json',
        },
    }).then(response =>
        response.ok
            ? Promise.resolve(response.json())
            : Promise.reject(response.status),
    )
}

export {
    fetchFromIssue,
    fetchFromApi,
    fetchWeatherForecastForLocation,
    fetchFromNotificationService,
    fetchAndStoreIpAddress,
    fetchCacheClear,
    fetchDeprecationWarning,
    fetchIssueSummary,
}
