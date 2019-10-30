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
import {
    defaultSettings,
    notificationTrackingUrl,
    notificationEdition,
} from './settings/defaults'
import { cacheClearCache } from './storage'
import { Forecast, AccuWeatherLocation, WeatherForecast } from '../common'
import { FSPaths, APIPaths } from 'src/paths'
import { Front, IssueWithFronts } from '../../../common/src'

export type ValidatorFn<T> = (response: any | T) => boolean

const fetchIssueWithFrontsFromAPI = async (
    id: string,
): Promise<IssueWithFronts> => {
    const apiUrl = await getSetting('apiUrl')
    const issue: Issue = await fetch(`${apiUrl}${APIPaths.issue(id)}`).then(
        res => {
            if (res.status !== 200) {
                throw new Error('Failed to fetch')
            }
            return res.json()
        },
    )
    const fronts: Front[] = await Promise.all(
        issue.fronts.map(frontId =>
            fetch(`${apiUrl}${APIPaths.front(id, frontId)}`).then(res => {
                if (res.status !== 200) {
                    throw new Error('Failed to fetch')
                }
                return res.json()
            }),
        ),
    )
    return {
        ...issue,
        fronts,
    }
}

const fetchIssueWithFrontsFromFS = (id: string): Promise<IssueWithFronts> =>
    getJson<Issue>(FSPaths.issue(id)).then(async issue => {
        const fronts = await Promise.all(
            issue.fronts.map(frontId =>
                getJson<Front>(FSPaths.front(id, frontId)),
            ),
        )
        return {
            ...issue,
            fronts,
        }
    })

const fetchIssue = (
    localIssueId: Issue['localId'],
    publishedIssueId: Issue['publishedId'],
): CachedOrPromise<IssueWithFronts> => {
    /*
    retrieve any cached value if we have any
    TODO: invalidate/background refresh these values
    */
    const { retrieve, store } = withCache<IssueWithFronts>('issue')
    return createCachedOrPromise(
        [
            retrieve(localIssueId),
            async () => {
                const issueOnDevice = await isIssueOnDevice(localIssueId)
                if (issueOnDevice) {
                    return fetchIssueWithFrontsFromFS(localIssueId)
                } else {
                    return fetchIssueWithFrontsFromAPI(publishedIssueId)
                }
            },
        ],
        {
            savePromiseResultToValue: result => {
                store(localIssueId, result)
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
        retrieve: retrieveWeatherForecastSummary,
        store: storeWeatherForecastSummary,
    } = withCache<WeatherForecast>('weatherForecastSummary')

    const getWeatherForecast = async (): Promise<WeatherForecast> => {
        const ip = await fetchIpAddress()
        const location = await fetchFromWeatherApi<AccuWeatherLocation>(
            `locations/v1/cities/ipAddress?q=${ip}&details=false`,
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

    return createCachedOrPromise(
        [retrieveWeatherForecastSummary(`forecasts`), getWeatherForecast],
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
        platform:
            Platform.OS === 'ios'
                ? notificationEdition.ios
                : notificationEdition.android,
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

const notificationTracking = (
    notificationId: string,
    type: 'received' | 'downloaded',
) => {
    const url = notificationTrackingUrl(notificationId, type)
    return fetch(url)
}

export {
    fetchIssue,
    fetchWeatherForecastForLocation,
    fetchFromNotificationService,
    fetchAndStoreIpAddress,
    fetchCacheClear,
    fetchDeprecationWarning,
    notificationTracking,
}
