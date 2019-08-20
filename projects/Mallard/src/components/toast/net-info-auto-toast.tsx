import { useNetInfo } from '@react-native-community/netinfo'
import { useEffect } from 'react'
import { useToast } from 'src/hooks/use-toast'

const NetInfoAutoToast = () => {
    const { showToast } = useToast()
    const { isConnected } = useNetInfo()
    useEffect(() => {
        if (!isConnected) {
            showToast('No internet connection')
        }
    }, [isConnected]) // eslint-disable-line react-hooks/exhaustive-deps
    return null
}

export { NetInfoAutoToast }
