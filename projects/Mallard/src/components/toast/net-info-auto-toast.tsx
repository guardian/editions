import { useNetInfo } from 'src/hooks/use-net-info'
import { NetInfoStateType } from '@react-native-community/netinfo'
import { useEffect } from 'react'
import { useToast } from 'src/hooks/use-toast'

const NetInfoAutoToast = () => {
    const { showToast } = useToast()
    const { isConnected, type } = useNetInfo()
    useEffect(() => {
        const time = setTimeout(() => {
            if (!isConnected && type !== NetInfoStateType.unknown) {
                showToast('No internet connection')
            }
        }, 100)
        return () => {
            clearTimeout(time)
        }
    }, [isConnected]) // eslint-disable-line react-hooks/exhaustive-deps
    return null
}

export { NetInfoAutoToast }
