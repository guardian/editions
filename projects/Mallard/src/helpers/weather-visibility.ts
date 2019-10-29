import { getSetting, storeSetting } from './settings'
import { useState, useEffect } from 'react'

type WeatherVisibility = 'shown' | 'hidden'
type Data =
    | { loading: true; value?: undefined; error?: undefined }
    | { loading?: undefined; value: WeatherVisibility; error?: undefined }
    | { loading?: undefined; value?: undefined; error: Error }
let data: Data = { loading: true }
let fetching: boolean = false
const callbacks: (() => void)[] = []
const refresh = () => callbacks.forEach(cb => cb())

const loadWeatherVisibility = () => {
    fetching = true
    getSetting('weatherVisibility')
        .then((value: any) => (data = { value }), error => (data = { error }))
        .then(refresh)
}

const setWeatherVisibility = (visibility: WeatherVisibility) => {
    storeSetting('weatherVisibility', visibility)
    data = { value: visibility }
    refresh()
}

export const toggleWeatherVisibility = (value: WeatherVisibility) => {
    setWeatherVisibility(value === 'shown' ? 'hidden' : 'shown')
}

export const useWeatherVisibility = (): Data => {
    const [localData, setLocalData] = useState(data)
    useEffect(() => {
        const cb = () => setLocalData(data as any)
        callbacks.push(cb)
        if (!fetching) loadWeatherVisibility()
        return () => void callbacks.splice(callbacks.indexOf(cb), 1)
    }, [])
    return localData
}
