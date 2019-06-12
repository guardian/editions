import { useEffect } from 'react'
import { useSettings } from './use-settings'
import { useResponse, Response, Error, withResponse } from './use-response'

let naiveCache: { [url: string]: any } = {}

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
const useFetch = <T>(
    url: string,
    validator: (response: any) => boolean = () => true,
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
                        onError({ message: 'Failed to parse data' })
                    }
                }),
            )
            .catch((err: Error) => {
                /*
                if we have stale data let's 
                just serve it and eat this up
                */
                if (response.type !== 'success') {
                    onError(err)
                }
            })
    }, [url])

    return response
}

export const useEndpointResponse = <T>(
    path: string,
    validator: (response: T | any) => boolean = () => true,
) => {
    const [{ apiUrl }] = useSettings()
    const url = apiUrl + '/' + path
    return withResponse<T>(useFetch(url, validator))
}
