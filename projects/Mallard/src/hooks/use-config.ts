import { useState, useEffect } from 'react'
import DeviceInfo from 'react-native-device-info'

const oneGB = 1073741824

type Config = {
    optimisedFlatList: boolean
}

const useConfig = () => {
    const [config, setConfig] = useState<Config>({ optimisedFlatList: true })

    useEffect(() => {
        DeviceInfo.getTotalMemory().then(
            deviceMemory =>
                deviceMemory > oneGB &&
                setConfig({ ...config, optimisedFlatList: false }),
        )
    }, [config])

    return {
        config,
    }
}

export { useConfig }
