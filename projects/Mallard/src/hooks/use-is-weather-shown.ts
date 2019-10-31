import { getSetting, storeSetting } from '../helpers/settings'
import { useState, useEffect } from 'react'

let data: { value?: boolean; error?: Error } = {}
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

/** Return `undefined` while we're loading the setting. */
export const useIsWeatherShown = (): boolean | undefined => {
    const [localData, setLocalData] = useState(data)
    useEffect(() => {
        const cb = () => setLocalData(data)
        callbacks.push(cb)
        if (!initialized) load()
        return () => void callbacks.splice(callbacks.indexOf(cb), 1)
    }, [])
    if (localData.error) throw localData.error
    return localData.value
}
