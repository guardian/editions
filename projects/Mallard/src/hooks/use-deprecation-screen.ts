import { useState, Dispatch, SetStateAction, useEffect } from 'react'
import DeviceInfo from 'react-native-device-info'
import { fetchDeprecationWarning } from 'src/helpers/fetch'
import { Platform } from 'react-native'

const useDeprecationModal = (): {
    showModal: boolean
    setShowModal: Dispatch<SetStateAction<boolean>>
} => {
    const [showModal, setShowModal] = useState<boolean>(false)

    useEffect(() => {
        fetchDeprecationWarning().then(
            (buildNumbers: { ios: string; android: string }) => {
                const platformDeprecationBuildNumber =
                    Platform.OS === 'ios' && buildNumbers
                        ? buildNumbers.ios
                        : buildNumbers.android
                if (
                    DeviceInfo.getBuildNumber() &&
                    DeviceInfo.getBuildNumber() <=
                        platformDeprecationBuildNumber
                ) {
                    setShowModal(true)
                }
            },
        )
    }, [])

    return {
        showModal,
        setShowModal,
    }
}

export { useDeprecationModal }
