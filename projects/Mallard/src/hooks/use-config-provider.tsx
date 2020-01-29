import React, { createContext, useState, useEffect, useContext } from 'react'
import DeviceInfo from 'react-native-device-info'

const oneGB = 1073741824

const ConfigContext = createContext({
    largeDeviceMemeory: false,
})

export const largeDeviceMemory = () => {
    return DeviceInfo.getTotalMemory().then(
        deviceMemory => deviceMemory > oneGB,
    )
}

export const ConfigProvider = ({ children }: { children: React.ReactNode }) => {
    const [largeDeviceMemeory, setLargeDeviceMemory] = useState(false)

    useEffect(() => {
        largeDeviceMemory().then(deviceMemory =>
            setLargeDeviceMemory(deviceMemory),
        )
    }, [])

    return (
        <ConfigContext.Provider value={{ largeDeviceMemeory }}>
            {children}
        </ConfigContext.Provider>
    )
}

export const useLargeDeviceMemory = () =>
    useContext(ConfigContext).largeDeviceMemeory
