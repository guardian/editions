import { useEffect } from 'react'
import { useSettings } from './use-settings'
import { useResponse, Response, Error } from './use-response'
import {
    REQUEST_INVALID_RESPONSE_VALIDATION,
    LOCAL_JSON_INVALID_RESPONSE_VALIDATION,
} from '../helpers/words'
import { getJson, fileIsIssue } from 'src/helpers/files'
import { useFileList } from './use-fs'

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

const useJson = <T>(
    path: string,
    { validator }: { validator: ValidatorFn<T> } = { validator: () => true },
): Response<T> => {
    const { response, onSuccess, onError } = useResponse<T>(
        naiveJsonCache[path] ? naiveJsonCache[path] : null,
    )
    useEffect(() => {
        getJson(path)
            .then(data => {
                if (data && validator(data)) {
                    naiveJsonCache[path] = data
                    onSuccess(data as T)
                } else {
                    onError({
                        message: LOCAL_JSON_INVALID_RESPONSE_VALIDATION,
                    })
                }
            })
            .catch((err: Error) => {
                if (response.state !== 'success') {
                    onError(err)
                }
            })
    }, [path]) // eslint-disable-line react-hooks/exhaustive-deps
    return response
}

const useFetch = <T>(
    url: string,
    {
        validator,
        skip,
    }: {
        validator: ValidatorFn<T>
        /*
        skip running the effect if we don't want it.
        this allows us conditionally calling the hook.

        'skip' seems to be a pattern for conditional effects
        https://github.com/trojanowski/react-apollo-hooks/issues/21
        */
        skip?: boolean
    } = {
        validator: () => true,
        skip: false,
    },
): Response<T> => {
    const { response, onSuccess, onError } = useResponse(
        naiveCache[url] ? naiveCache[url] : null,
    )
    useEffect(() => {
        if (skip) return
        fetch(url)
            .then(res => {
                if (res.status >= 500) {
                    throw new Error('Failed to fetch') // 500s don't return json
                }
                return res
                    .json()
                    .then(res => {
                        if (res && validator(res)) {
                            naiveCache[url] = res
                            onSuccess(res as T)
                        } else {
                            onError({
                                message: REQUEST_INVALID_RESPONSE_VALIDATION,
                            })
                        }
                    })
                    .catch(err => {
                        onError({
                            message: REQUEST_INVALID_RESPONSE_VALIDATION,
                        })
                    })
            })
            .catch((err: Error) => {
                /*
                if we have stale data let's
                just serve it and eat this up
                */
                if (response.state !== 'success') {
                    onError(err)
                }
            })
    }, [url, skip]) // eslint-disable-line react-hooks/exhaustive-deps

    return response
}

export const useJsonOrEndpoint = <T>(
    issueId: string,
    fsPath: string,
    endpointPath: string,
    { validator = () => true }: { validator?: ValidatorFn<T> } = {},
) => {
    const [{ apiUrl }] = useSettings()
    const isIssueOnDevice =
        useFileList()[0].find(
            file => fileIsIssue(file) && file.issue.key === issueId,
        ) !== undefined
    const responses = [
        useFetch<T>(`${apiUrl}${endpointPath}`, {
            validator,
            skip: isIssueOnDevice,
        }),
        useJson<T>(fsPath, { validator }),
    ]
    const winner = responses.find(({ state }) => state === 'success')

    if (winner) {
        return winner
    }
    if (isIssueOnDevice) {
        return responses[1]
    }
    return responses[0]
}
