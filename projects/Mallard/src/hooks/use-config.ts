import { useState, useEffect } from 'react'
import DeviceInfo from 'react-native-device-info'

const oneGB = 1073741824

type Config = {
    optimisedFlatList: boolean
}

const largeDeviceMemory = async () => {
    return DeviceInfo.getTotalMemory().then(
        deviceMemory => deviceMemory > oneGB,
    )
}

const useConfig = () => {
    const [config, setConfig] = useState<Config>({ optimisedFlatList: true })

    useEffect(() => {
        largeDeviceMemory().then(deviceMemory =>
            setConfig({ ...config, optimisedFlatList: deviceMemory }),
        )
    }, [config])

    return {
        config,
    }
}

export { largeDeviceMemory, useConfig }
