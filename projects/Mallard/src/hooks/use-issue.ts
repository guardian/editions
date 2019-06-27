import { Response, usePromiseAsResponse } from './use-response'
import {
    REQUEST_INVALID_RESPONSE_VALIDATION,
    LOCAL_JSON_INVALID_RESPONSE_VALIDATION,
} from '../helpers/words'
import { getJson, isIssueInDevice } from 'src/helpers/files'
import { Issue } from 'src/common'
import { getSetting } from 'src/helpers/settings'
import {
    returnResolved,
    returnPromise,
    PromiseMaybe,
} from 'src/helpers/promise-maybe'

let naiveCache: { [url: string]: any } = {}
let naiveJsonCache: { [path: string]: any } = {}

export const clearLocalCache = () => {
    for (let url in naiveCache) {
        delete naiveCache[url]
        console.log(`deleted ${url}`)
    }
    for (let path in naiveJsonCache) {
        delete naiveJsonCache[path]
        console.log(`deleted ${path}`)
    }
}

/*
use a validator to abort a fetch request
if doesn't contain the right type - say on an error 500
*/
type ValidatorFn<T> = (response: any | T) => boolean

const pickFromIssueAsync = async <T>(
    issueId: Issue['key'],
    fsPath: string,
    endpointPath: string,
    { validator }: { validator: ValidatorFn<T> } = { validator: () => true },
): Promise<T> => {
    const [issueInDevice, apiUrl] = await Promise.all([
        isIssueInDevice(issueId),
        getSetting('apiUrl'),
    ])

    if (issueInDevice) {
        return getJson(fsPath).then(data => {
            if (data && validator(data)) {
                naiveJsonCache[fsPath] = data
                return data
            } else {
                throw new Error(LOCAL_JSON_INVALID_RESPONSE_VALIDATION)
            }
        })
    } else {
        return fetch(apiUrl + endpointPath).then(res => {
            if (res.status >= 500) {
                throw new Error('Failed to fetch') // 500s don't return json
            }
            return res.json().then(data => {
                if (data && validator(data)) {
                    naiveCache[endpointPath] = data
                    return data as T
                } else {
                    throw new Error(REQUEST_INVALID_RESPONSE_VALIDATION)
                }
            })
        })
    }
}

const pickFromIssue = <T>(
    issueId: Issue['key'],
    fsPath: string,
    endpointPath: string,
    { validator }: { validator: ValidatorFn<T> } = { validator: () => true },
): PromiseMaybe<T> => {
    //TODO: we need to invalidate caches
    if (naiveJsonCache[fsPath]) return returnResolved(naiveJsonCache[fsPath])
    if (naiveCache[endpointPath])
        return returnResolved(naiveCache[endpointPath])

    return returnPromise(() =>
        pickFromIssueAsync(issueId, fsPath, endpointPath, { validator }),
    )
}

export const useJsonOrEndpoint = <T>(
    issueId: string,
    fsPath: string,
    endpointPath: string,
    { validator = () => true }: { validator?: ValidatorFn<T> } = {},
): Response<T> => {
    return usePromiseAsResponse(
        pickFromIssue(issueId, fsPath, endpointPath, { validator }),
    )
}
