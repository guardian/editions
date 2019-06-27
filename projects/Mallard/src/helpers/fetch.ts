import { withCache } from './cache'
import { getSetting } from './settings'
import {
    REQUEST_INVALID_RESPONSE_VALIDATION,
    LOCAL_JSON_INVALID_RESPONSE_VALIDATION,
} from './words'
import { PromiseMaybe, returnResolved, returnPromise } from './promise-maybe'
import { getJson, isIssueInDevice } from './files'
import { Issue } from 'src/common'

export type ValidatorFn<T> = (response: any | T) => boolean

/*
get stuff from API
*/
const fetchFromApiSlow = async <T>(
    path: string,
    {
        validator,
    }: {
        validator: ValidatorFn<T>
    },
): Promise<T> => {
    const { store, retrieve } = withCache('api')
    const apiUrl = await getSetting('apiUrl')

    if (retrieve(path)) {
        return Promise.resolve(retrieve(path) as T)
    }

    return fetch(apiUrl + path)
        .then(res => {
            if (res.status >= 500) {
                throw new Error('Failed to fetch') // 500s don't return json
            }
            return res.json()
        })
        .then(data => {
            if (data && validator(data)) {
                store(path, data)
                return data
            } else {
                throw new Error(REQUEST_INVALID_RESPONSE_VALIDATION)
            }
        })
}

const fetchFromApi = <T>(
    endpointPath: string,
    { validator }: { validator: ValidatorFn<T> } = { validator: () => true },
): PromiseMaybe<T> => {
    const { retrieve } = withCache('api')
    if (retrieve(endpointPath)) {
        return returnResolved(retrieve(endpointPath) as T)
    }
    return returnPromise(() =>
        fetchFromApiSlow<T>(endpointPath, {
            validator,
        }),
    )
}

/*
Fetch locally
*/
const fetchFromLocalAsync = <T>(
    path: string,
    {
        validator,
    }: {
        validator: ValidatorFn<T>
    },
): Promise<T> =>
    getJson(path).then(data => {
        const { store } = withCache('local')
        if (data && validator(data)) {
            store(path, data)
            return data
        } else {
            throw new Error(LOCAL_JSON_INVALID_RESPONSE_VALIDATION)
        }
    })

/*
Fetch from either
*/
const fetchFromIssueSlow = async <T>(
    issueId: Issue['key'],
    fsPath: string,
    endpointPath: string,
    { validator }: { validator: ValidatorFn<T> } = { validator: () => true },
): Promise<T> => {
    const issueInDevice = await isIssueInDevice(issueId)
    if (issueInDevice) {
        return fetchFromLocalAsync<T>(fsPath, {
            validator,
        })
    } else {
        return fetchFromApiSlow<T>(endpointPath, {
            validator,
        })
    }
}

const fetchFromIssue = <T>(
    issueId: Issue['key'],
    fsPath: string,
    endpointPath: string,
    { validator }: { validator: ValidatorFn<T> } = { validator: () => true },
): PromiseMaybe<T> => {
    /*
    retrieve any cached value if we have any
    TODO: invalidate/background refresh these values
    */
    const { retrieve: retrieveApi } = withCache('api')
    const { retrieve: retrieveLocal } = withCache('local')
    if (retrieveLocal(fsPath)) return returnResolved(retrieveLocal(fsPath) as T)
    if (retrieveApi(endpointPath))
        return returnResolved(retrieveApi(endpointPath) as T)

    return returnPromise(() =>
        fetchFromIssueSlow(issueId, fsPath, endpointPath, { validator }),
    )
}

export { fetchFromIssue, fetchFromApi, fetchFromIssueSlow, fetchFromApiSlow }
