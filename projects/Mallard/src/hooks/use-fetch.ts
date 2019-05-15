import { useEffect, useState } from 'react'
import { getSetting } from '../helpers/settings'

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
    const [data, updateData] = useState(initialState)
    useEffect(() => {
        getSetting('apiUrl').then(apiUrl =>
            fetch(apiUrl + '/' + path).then(res =>
                res.json().then(res => {
                    updateData(transform(res))
                }),
            ),
        )
    }, [])

    return data
}
