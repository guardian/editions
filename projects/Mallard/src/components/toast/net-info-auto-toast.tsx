import { NetInfo } from 'src/hooks/use-net-info'
import { useEffect } from 'react'
import { useToast } from 'src/hooks/use-toast'
import { NetInfoStateType } from '@react-native-community/netinfo'
import { useQuery } from 'src/hooks/apollo'
import gql from 'graphql-tag'

const NET_INFO_QUERY = gql`
    {
        netInfo @client {
            type @client
            isConnected @client
        }
    }
`
type NetInfoQueryValue = {
    netInfo: Pick<NetInfo, 'type' | 'isConnected'>
}

const NetInfoAutoToast = () => {
    const { showToast } = useToast()
    const res = useQuery<NetInfoQueryValue>(NET_INFO_QUERY)
    const isConnected = res.loading || res.data.netInfo.isConnected

    useEffect(() => {
        if (res.loading) return
        const time = setTimeout(() => {
            const { type } = res.data.netInfo
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
