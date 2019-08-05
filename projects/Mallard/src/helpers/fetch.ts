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
import { getJson, isIssueOnDevice } from './files'
import { Issue } from 'src/common'

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
    issueId: Issue['key'],
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
                const issueOnDevice = await isIssueOnDevice(issueId)
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

const fetchWeather = <T>(
    endpointPath: string,
    { validator }: { validator?: ValidatorFn<T> } = {},
): CachedOrPromise<T> => {
    const { retrieve, store } = withCache<T>('weather')
    return createCachedOrPromise(
        [
            retrieve(endpointPath),
            async () => {
                return fetchFromWeatherApi<T>(endpointPath, {
                    validator,
                })
            },
        ],
        {
            savePromiseResultToValue: result => store(endpointPath, result),
        },
    )
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
    })
        .then(response => console.log('Response', JSON.stringify(response)))
        .catch(e => console.log('Error', JSON.stringify(e)))
}

export {
    fetchFromIssue,
    fetchFromApi,
    fetchWeather,
    fetchFromNotificationService,
}
