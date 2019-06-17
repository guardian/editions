import { useEffect } from 'react'
import { useSettings } from './use-settings'
import { useResponse, Response, Error, withResponse } from './use-response'
import {
    REQUEST_INVALID_RESPONSE_VALIDATION,
    LOCAL_JSON_INVALID_RESPONSE_VALIDATION,
} from '../helpers/words'
import { getJson, issuesDir } from 'src/helpers/files'

let naiveCache: { [url: string]: any } = {}
let naiveJsonCache: { [path: string]: any } = {}

export const clearLocalCache = () => {
    for (let url in naiveCache) {
        delete naiveCache[url]
        console.log(`deleted ${url}`)
    }
}

/*
use a validator to abort a fetch request
if doesn't contain the right type - say on an error 500
*/
type ValidatorFn<T> = (response: any | T) => boolean

const useJson = <T>(path: string, validator: ValidatorFn<T> = () => true) => {
    const { response, onSuccess, onError } = useResponse(
        naiveJsonCache[path] ? naiveJsonCache[path] : null,
    )
    useEffect(() => {
        getJson(path)
            .then(data => {
                if (data && validator(data)) {
                    naiveJsonCache[path] = data
                    onSuccess(data)
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
    }, [path])
    return response
}

const useFetch = <T>(
    url: string,
    validator: ValidatorFn<T> = () => true,
): Response<T> => {
    const { response, onSuccess, onError } = useResponse(
        naiveCache[url] ? naiveCache[url] : null,
    )
    useEffect(() => {
        fetch(url)
            .then(res =>
                res.json().then(res => {
                    if (res && validator(res)) {
                        naiveCache[url] = res
                        onSuccess(res)
                    } else {
                        onError({
                            message: REQUEST_INVALID_RESPONSE_VALIDATION,
                        })
                    }
                }),
            )
            .catch((err: Error) => {
                /*
                if we have stale data let's 
                just serve it and eat this up
                */
                if (response.state !== 'success') {
                    onError(err)
                }
            })
    }, [url])

    return response
}

export const useJsonResponse = <T>(
    issue: string,
    path: string,
    validator: ValidatorFn<T> = () => true,
) => {
    const fullPath = issuesDir + '/' + issue + '/' + path + '.json'
    return withResponse<T>(useJson(fullPath, validator))
}

export const useEndpointResponse = <T>(
    path: string,
    validator: ValidatorFn<T> = () => true,
) => {
    const [{ apiUrl }] = useSettings()
    const url = apiUrl + '/' + path
    return withResponse<T>(useFetch(url, validator))
}
