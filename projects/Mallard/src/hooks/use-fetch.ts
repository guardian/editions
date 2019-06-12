import { useEffect, useState, ReactNode, ReactElement } from 'react'
import { useSettings } from './use-settings'

let naiveCache: { [url: string]: any } = {}
interface PendingResponse {
    type: 'loading' | 'error'
}

interface ErroredResponse {
    type: 'error'
    error?: {}
}
interface SuccesfulResponse<T> {
    type: 'success'
    response: T
}
type Response<T> = PendingResponse | ErroredResponse | SuccesfulResponse<T>

export const clearLocalCache = () => {
    for (let url in naiveCache) {
        delete naiveCache[url]
        console.log(`deleted ${url}`)
    }
}

export const withResponse = <T>(
    response: Response<T>,
    {
        success,
        loading,
        error,
    }: {
        success: (resp: T) => ReactElement
        loading: () => ReactElement
        error: () => ReactElement
    },
) => {
    if (response.type === 'success' && response.response)
        return success(response.response)
    else if (response.type === 'loading') return loading()
    else return error()
}

export const useFetch = <T>(url: string): Response<T> => {
    const [response, setResponse] = useState(
        naiveCache[url] ? naiveCache[url] : null,
    )
    const [error, setError] = useState(undefined)
    const [type, setType] = useState<Response<T>['type']>(
        naiveCache[url] ? 'success' : 'loading',
    )
    useEffect(() => {
        fetch(url)
            .then(res =>
                res.json().then(res => {
                    naiveCache[url] = res
                    setType('success')
                    setResponse(res)
                }),
            )
            .catch(err => {
                setType('error')
                setError(err)
            })
    }, [url])

    switch (type) {
        case 'success':
            return { response, type }
        case 'loading':
            return { type }
        case 'error':
            return { error, type }
    }
}

export const useEndpoint = <T>(path: string): Response<T> => {
    const [{ apiUrl }] = useSettings()
    const url = apiUrl + '/' + path
    return useFetch(url)
}
