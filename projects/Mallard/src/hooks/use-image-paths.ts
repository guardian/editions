import { useEffect, useState } from 'react'
import ImageResizer from 'react-native-image-resizer'
import RNFetchBlob from 'rn-fetch-blob'
import { imageForScreenSize } from 'src/helpers/screen'
import { APIPaths, FSPaths } from 'src/paths'
import { Image, ImageSize, Issue, ImageUse } from '../../../common/src'
import { useIssueSummary } from './use-issue-summary'
import { Platform } from 'react-native'
import { useApiUrl } from './use-settings'

const getFsPath = (
    localIssueId: Issue['localId'],
    image: Image,
    size: ImageSize,
    use: ImageUse,
) => FSPaths.image(localIssueId, size, image, use)

export const selectImagePath = async (
    apiUrl: string,
    localIssueId: Issue['localId'],
    publishedIssueId: Issue['publishedId'],
    image: Image,
    use: ImageUse,
) => {
    const imageSize = await imageForScreenSize()
    const api = `${apiUrl}${APIPaths.image(
        publishedIssueId,
        imageSize,
        image,
        use,
    )}`

    const fs = getFsPath(localIssueId, image, imageSize, use)
    const fsExists = await RNFetchBlob.fs.exists(fs)

    const fsUpdatedPath = Platform.OS === 'android' ? 'file:///' + fs : fs
    return fsExists ? fsUpdatedPath : api
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
    return resized.uri
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

export const useImagePath = (image?: Image, use: ImageUse = 'full-size') => {
    const { issueId } = useIssueSummary()

    const [paths, setPaths] = useState<string | undefined>()

    // FIXME: we should handle the loading status correctly.
    const apiUrl = useApiUrl() || ''

    useEffect(() => {
        if (issueId && image) {
            const { localIssueId, publishedIssueId } = issueId
            selectImagePath(
                apiUrl,
                localIssueId,
                publishedIssueId,
                image,
                use,
            ).then(setPaths)
        }
        // eslint-disable-next-line react-hooks/exhaustive-deps
    }, [
        apiUrl,
        image,
        use,
        // eslint-disable-next-line react-hooks/exhaustive-deps
        issueId ? issueId.publishedIssueId : undefined, // Why isn't this just issueId?
        // eslint-disable-next-line react-hooks/exhaustive-deps
        issueId ? issueId.localIssueId : undefined,
    ])
    if (image === undefined) return undefined
    return paths
}

export const useScaledImage = (largePath: string, width: number) => {
    const isRemote = largePath.slice(0, 4) === 'http'

    const [uri, setUri] = useState<string | undefined>(
        isRemote ? largePath : undefined,
    )
    useEffect(() => {
        if (!isRemote) {
            compressImagePath(largePath, width).then(setUri)
        }
        // eslint-disable-next-line react-hooks/exhaustive-deps
    }, [largePath, width])
    return uri
}
