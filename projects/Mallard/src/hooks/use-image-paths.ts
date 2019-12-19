import { useEffect, useState } from 'react'
import ImageResizer from 'react-native-image-resizer'
import RNFetchBlob from 'rn-fetch-blob'
import { imageForScreenSize } from 'src/helpers/screen'
import { APIPaths, FSPaths } from 'src/paths'
import { Image, ImageSize, Issue, ImageUse } from '../../../Apps/common/src'
import { useIssueSummary } from './use-issue-summary'
import { Platform } from 'react-native'
import { useApiUrl } from './use-settings'
import { errorService } from 'src/services/errors'
import gql from 'graphql-tag'
import { useQuery } from './apollo'

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
    try {
        const resized = await ImageResizer.createResizedImage(
            path,
            width,
            99999,
            'JPEG',
            100,
            0,
        )
        return resized.uri
    } catch (error) {
        errorService.captureException(error)
        return path
    }
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

    const [path, setPath] = useState<string | undefined>()

    // FIXME: we should handle the loading status correctly.
    const apiUrl = useApiUrl() || ''

    useEffect(() => {
        let localSetPath = setPath
        if (issueId && image) {
            const { localIssueId, publishedIssueId } = issueId
            selectImagePath(
                apiUrl,
                localIssueId,
                publishedIssueId,
                image,
                use,
            ).then(newPath => localSetPath(newPath))
        }
        return () => void (localSetPath = () => {})
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
    return path
}

type QueryValue = { scaledImage: { uri: string | null } }
type QueryVars = { path: string; width: number }
const SCALED_IMAGE_QUERY = gql`
    query($path: String, $width: Int) {
        scaledImage(path: $path, width: $width) @client
    }
`

export const createScaledImageResolver = () => {
    const promises = new Map()

    return (_: unknown, variables: QueryVars) => {
        const { path, width } = variables
        if (path.slice(0, 4) === 'http')
            return { __typename: 'ScaledImage', uri: path }

        const key = JSON.stringify([path, width])
        const value = promises.get(key)
        if (value != null) return value

        const promise = compressImagePath(path, width).then(uri => {
            return { __typename: 'ScaledImage', uri }
        })

        promises.set(key, promise)
        return promise
    }
}

export const useScaledImage = (largePath: string, width: number) => {
    const query = useQuery<QueryValue, QueryVars>(SCALED_IMAGE_QUERY, {
        path: largePath,
        width,
    })

    if (query.loading) return undefined
    return (query.data && query.data.scaledImage.uri) || undefined
}
