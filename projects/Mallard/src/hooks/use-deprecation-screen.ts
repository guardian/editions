import { useState } from 'react'
import DeviceInfo from 'react-native-device-info'
import { useNetInfo } from './use-net-info'

const useDeprecationModal = () => {
    const { isConnected } = useNetInfo()
    const [showModal, setShowModal] = useState<boolean>(false)

    // GO AND GET THE NUMBER HERE

    if (
        isConnected &&
        DeviceInfo.getBuildNumber() <= '465' &&
        showModal === false
    ) {
        setShowModal(true)
    }

    return {
        showModal,
    }
}

export { useDeprecationModal }
