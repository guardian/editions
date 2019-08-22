import { useState, useEffect } from 'react'
import { FSPaths, APIPaths } from 'src/paths'
import { imageForScreenSize } from 'src/helpers/screen'
import { Image } from '../../../common/src'
import RNFetchBlob from 'rn-fetch-blob'
import { useIssueId } from './use-issue-id'

const selectImagePath = async (issueId: string, { source, path }: Image) => {
    const api = `${APIPaths.mediaBackend}${APIPaths.media(
        issueId,
        imageForScreenSize(),
        source,
        path,
    )}`
    const fs = FSPaths.media(issueId, source, path)
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
    const issueId = useIssueId()

    const [paths, setPaths] = useState<string | undefined>()

    useEffect(() => {
        selectImagePath(issueId || 'issue', image).then(setPaths)
    }, [])

    return paths
}

export { useImagePath, selectImagePath }
