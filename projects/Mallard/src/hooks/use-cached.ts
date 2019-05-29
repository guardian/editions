import NetInfo from '@react-native-community/netinfo'

import { useEffect, useState } from 'react'
import { useSettings } from './use-settings'
import axios from 'axios'
import RNFetchBlob from 'rn-fetch-blob'
import { DatePickerAndroid } from 'react-native'

export const useCached = <Fetchable>(
    path: string,
    initialState: Fetchable,
): Fetchable => {
    const [{ apiUrl }] = useSettings()
    const localPath = `storage/${path}`

    const [data, updateData] = useState(initialState)

    const fetchAndStore = async (path: string, date: Date | null = null) => {
        const network = await NetInfo.fetch()
        const headers = date
            ? {
                  'If-Modified-Since': date.toUTCString(),
              }
            : {}
        if (!network.isConnected) {
            //do something to deal with this here!
            return
        }
        const resp = await axios(`${apiUrl}/${path}`, { headers })
        if (resp.status == 304) {
            return
        }
        const data = resp.data
        const modified = resp.headers['Last-Modified']
        RNFetchBlob.fs.createFile(localPath, data, 'utf8')
        RNFetchBlob.fs.createFile(
            `${localPath}.date`,
            JSON.stringify({ date: modified }),
            'utf8',
        )
    }
    useEffect(() => {
        ;(async () => {
            const exists = await RNFetchBlob.fs.exists(localPath)
            if (!exists) return fetchAndStore(path)

            const stat = await RNFetchBlob.fs.stat(localPath)
            //Does anyone document whether their timestamps are seconds or miliseconds anymore?
            let updated = new Date(parseInt(stat.lastModified) * 1000)
            if (await RNFetchBlob.fs.exists(`${localPath}.date`)) {
                const dateFile = await RNFetchBlob.fs.readFile(
                    `${localPath}.date`,
                    'utf8',
                )
                const metadata = JSON.parse(dateFile)
                if ('date' in metadata) updated = new Date(metadata.date)
            }
            return fetchAndStore(path, updated)
        })()
    }, [path, apiUrl])

    return data
}
