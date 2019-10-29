import { getSetting, storeSetting } from '../helpers/settings'
import { useState, useEffect } from 'react'

type Data =
    | { loading: true; value?: undefined; error?: undefined }
    | { loading?: undefined; value: boolean; error?: undefined }
    | { loading?: undefined; value?: undefined; error: Error }
let data: Data = { loading: true }
let initialized = false
const callbacks: (() => void)[] = []
const refresh = () => callbacks.forEach(cb => cb())

const load = () => {
    initialized = true
    getSetting('isWeatherShown')
        .then((value: any) => (data = { value }), error => (data = { error }))
        .then(refresh)
}

export const setIsWeatherShown = (visibility: boolean) => {
    storeSetting('isWeatherShown', visibility)
    data = { value: visibility }
    refresh()
}

export const useIsWeatherShown = (): Data => {
    const [localData, setLocalData] = useState(data)
    useEffect(() => {
        const cb = () => setLocalData(data as any)
        callbacks.push(cb)
        if (!initialized) load()
        return () => void callbacks.splice(callbacks.indexOf(cb), 1)
    }, [])
    return localData
}
