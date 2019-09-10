import { useState, useEffect } from 'react'
import { FSPaths, APIPaths } from 'src/paths'
import { imageForScreenSize } from 'src/helpers/screen'
import { Image, Issue } from '../../../common/src'
import RNFetchBlob from 'rn-fetch-blob'
import { useIssueCompositeKey } from './use-issue-id'

const selectImagePath = async (
    localIssueId: Issue['localId'],
    publishedIssueId: Issue['publishedId'],
    { source, path }: Image,
) => {
    const api = `${APIPaths.mediaBackend}${APIPaths.media(
        publishedIssueId,
        imageForScreenSize(),
        source,
        path,
    )}`
    const fs = FSPaths.media(localIssueId, source, path)
    const fsExists = await RNFetchBlob.fs.exists(fs)
    return fsExists ? fs : api
}

/**
 * A simple helper to get image paths in order to try from the cache,
 * then the API if the error handler is called, otherwise returns `undefined`
 * if none are found
 *
 * TODO: cache these paths in a context in order not to check every time
 */

const useImagePath = (image: Image) => {
    const key = useIssueCompositeKey()

    const [paths, setPaths] = useState<string | undefined>()

    useEffect(() => {
        if (key) {
            const { localIssueId, publishedIssueId } = key
            selectImagePath(localIssueId, publishedIssueId, image).then(
                setPaths,
            )
        }
    }, [image, key])

    return paths
}

export { useImagePath, selectImagePath }
