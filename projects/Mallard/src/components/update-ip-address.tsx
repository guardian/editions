import { useNetInfo } from '@react-native-community/netinfo'
import { useEffect } from 'react'
import { fetchAndStoreIpAddress } from '../helpers/fetch'

const UpdateIpAddress = () => {
    const { isConnected } = useNetInfo()
    useEffect(() => {
        if (isConnected) {
            fetchAndStoreIpAddress()
        }
    }, [isConnected]) // eslint-disable-line react-hooks/exhaustive-deps
    return null
}

export { UpdateIpAddress }
