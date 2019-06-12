import { useEffect, useState } from 'react'
import { useSettings } from './use-settings'

let naiveCache: { [url: string]: any } = {}

export const clearLocalCache = () => {
    for (let url in naiveCache) {
        delete naiveCache[url]
        console.log(`deleted ${url}`)
    }
}

export const useFetch = <T>(url: string, initialState: T): T => {
    const initial = naiveCache[url] ? naiveCache[url] : initialState
    const [data, updateData] = useState(initial)
    useEffect(() => {
        fetch(url).then(res =>
            res.json().then(res => {
                naiveCache[url] = res
                updateData(res)
            }),
        )
    }, [url])

    return data
}

export const useEndpoint = <T>(path: string, initialState: T): T => {
    const [{ apiUrl }] = useSettings()
    const url = apiUrl + '/' + path
    return useFetch(url, initialState)
}
