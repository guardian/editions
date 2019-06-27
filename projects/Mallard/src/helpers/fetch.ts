import { withCache } from './fetch/cache'
import { getSetting } from './settings'
import {
    REQUEST_INVALID_RESPONSE_VALIDATION,
    LOCAL_JSON_INVALID_RESPONSE_VALIDATION,
} from './words'
import {
    ValueOrGettablePromise,
    valueOrGettablePromise,
} from './fetch/value-or-gettable-promise'
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
    return fetch(apiUrl + path)
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
): ValueOrGettablePromise<T> => {
    const { retrieve, store, clear } = withCache<T>('api')
    if (!cached) {
        clear(endpointPath)
        return {
            type: 'promise',
            getValue: () =>
                fetchFromApiSlow<T>(endpointPath, {
                    validator,
                }),
        }
    }
    return valueOrGettablePromise(
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
): ValueOrGettablePromise<T> => {
    /*
    retrieve any cached value if we have any
    TODO: invalidate/background refresh these values
    */
    const { retrieve, store } = withCache<T>('issue')
    return valueOrGettablePromise(
        [
            retrieve(fsPath),
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

export { fetchFromIssue, fetchFromApi }
