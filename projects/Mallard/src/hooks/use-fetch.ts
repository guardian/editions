import { useEffect, useState } from 'react'
import { useSettings } from './use-settings'

export const useFetch = <Fetchable>(
    url: string,
    initialState: Fetchable,
    transform: (_: Fetchable) => Fetchable = res => res,
): Fetchable => {
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

export const useEndpoint = <Fetchable>(
    path: string,
    initialState: Fetchable,
    transform: (_: Fetchable) => Fetchable = res => res,
): Fetchable => {
    const [{ apiUrl }] = useSettings()
    return useFetch(apiUrl + '/' + path, initialState, transform)
}
