import { useEffect, useState, ReactNode, ReactElement } from 'react'
import { useSettings } from './use-settings'

let naiveCache: { [url: string]: any } = {}

interface Error {
    message: string
    name?: string
}
interface PendingResponse {
    type: 'loading'
}

interface ErroredResponse {
    type: 'error'
    error: Error
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
        error: (error: Error) => ReactElement
    },
): ReactElement => {
    if (response.type === 'success') return success(response.response)
    else if (response.type === 'loading') return loading()
    else if (response.type === 'error') return error(response.error)
    else return error({ message: 'Request failed' })
}

export const useFetch = <T>(url: string): Response<T> => {
    const [response, setResponse] = useState(
        naiveCache[url] ? naiveCache[url] : null,
    )
    const [error, setError] = useState({ message: 'Mysterious error' })
    const [type, setType] = useState<Response<T>['type']>(
        naiveCache[url] ? 'success' : 'loading',
    )
    useEffect(() => {
        fetch(url)
            .then(res =>
                res.json().then(res => {
                    console.log(res)
                    if (res) {
                        naiveCache[url] = res
                        setResponse(res)
                        setType('success')
                    } else {
                        setType('error')
                    }
                }),
            )
            .catch((err: Error) => {
                setError(err)
                setType('error')
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
