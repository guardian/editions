import { useEffect, useState } from 'react'
import RNFetchBlob from 'rn-fetch-blob'
import { imageForScreenSize } from 'src/helpers/screen'
import { APIPaths, FSPaths } from 'src/paths'
import { Image, Issue } from '../../../common/src'
import { useIssueCompositeKey } from './use-issue-id'
import { useSettingsValue } from './use-settings'
import ImageResizer from 'react-native-image-resizer'

const selectImagePath = async (
    apiUrl: string,
    localIssueId: Issue['localId'],
    publishedIssueId: Issue['publishedId'],
    { source, path }: Image,
) => {
    const imageSize = await imageForScreenSize()
    const api = `${apiUrl}${APIPaths.media(
        publishedIssueId,
        imageSize,
        source,
        path,
    )}`
    const fs = FSPaths.media(localIssueId, source, path)
    const fsExists = await RNFetchBlob.fs.exists(fs)
    return fsExists ? fs : api
}

const compressImagePath = async (path: string, width: number) => {
    const resized = await ImageResizer.createResizedImage(
        path,
        width,
        99999,
        'JPEG',
        100,
        0,
    )
    return resized.path
}

/**
 * A simple helper to get image paths.
 * This will asynchronously try the cache, otherwise will return the API url
 * if not available in the cache.
 *
 * Until the cache lookup has resolved, this will return undefined.
 * When the lookup resolves, a rerender should be triggered.
 *
 *  */

const useImagePath = (image?: Image, width?: number) => {
    const key = useIssueCompositeKey()

    const [paths, setPaths] = useState<string | undefined>()
    const apiUrl = useSettingsValue.apiUrl()
    useEffect(() => {
        if (key && image) {
            console.log([apiUrl, image, key])
            const { localIssueId, publishedIssueId } = key
            selectImagePath(apiUrl, localIssueId, publishedIssueId, image).then(
                path => {
                    if (width) {
                        compressImagePath(path, width).then(setPaths)
                    } else {
                        setPaths(path)
                    }
                },
            )
        }
    }, [
        apiUrl,
        image,
        key ? key.publishedIssueId : undefined,
        key ? key.localIssueId : undefined,
    ])
    if (image === undefined) return undefined
    return paths
}

export { useImagePath, selectImagePath }
