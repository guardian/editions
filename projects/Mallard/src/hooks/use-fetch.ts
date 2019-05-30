import { useEffect, useState } from 'react'
import { useSettings } from './use-settings'

export const useFetch = <T>(
    url: string,
    initialState: T,
    transform: (_: T) => T = res => res,
): T => {
    const [data, updateData] = useState(initialState)
    useEffect(() => {
        fetch(url).then(res =>
            res.json().then(res => {
                updateData(transform(res))
            }),
        )
    }, [url])

    return data
}

export const useEndpoint = <T>(
    path: string,
    initialState: T,
    transform: (_: any) => T = res => res as T,
): T => {
    const [{ apiUrl }] = useSettings()
    return useFetch(apiUrl + '/' + path, initialState, transform)
}
