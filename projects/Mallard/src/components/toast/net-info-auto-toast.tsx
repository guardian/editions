import { useNetInfo } from 'src/hooks/use-net-info'
import { useEffect } from 'react'
import { useToast } from 'src/hooks/use-toast'
import { NetInfoStateType } from '@react-native-community/netinfo'

const NetInfoAutoToast = () => {
    const { showToast } = useToast()
    const { isConnected, type } = useNetInfo()
    useEffect(() => {
        const time = setTimeout(() => {
            if (!isConnected && type !== NetInfoStateType.unknown) {
                showToast('No internet connection')
            }
        }, 500)
        return () => {
            clearTimeout(time)
        }
    }, [isConnected]) // eslint-disable-line react-hooks/exhaustive-deps
    return null
}

export { NetInfoAutoToast }
