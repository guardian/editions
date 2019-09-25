import { useState, Dispatch, SetStateAction } from 'react'
import DeviceInfo from 'react-native-device-info'
import { useNetInfo } from './use-net-info'
import { fetchDeprecationWarning } from 'src/helpers/fetch'
import { Platform } from 'react-native'

const useDeprecationModal = async (): Promise<{
    showModal: boolean
    setShowModal: Dispatch<SetStateAction<boolean>>
}> => {
    const { isConnected } = useNetInfo()
    const [showModal, setShowModal] = useState<boolean>(false)

    if (!isConnected) {
        return {
            showModal,
            setShowModal,
        }
    }

    const deprecationBuildNumbers = await fetchDeprecationWarning()
    const platformDeprecationBuildNumber =
        Platform.OS === 'ios'
            ? deprecationBuildNumbers.ios
            : deprecationBuildNumbers.android

    if (
        isConnected &&
        DeviceInfo.getBuildNumber() <= platformDeprecationBuildNumber &&
        showModal === false
    ) {
        setShowModal(true)
    }

    return {
        showModal,
        setShowModal,
    }
}

export { useDeprecationModal }
