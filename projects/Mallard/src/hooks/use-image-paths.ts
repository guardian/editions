import { useEffect, useState } from 'react'
import RNFetchBlob from 'rn-fetch-blob'
import { imageForScreenSize } from 'src/helpers/screen'
import { APIPaths, FSPaths } from 'src/paths'
import { Image, Issue } from '../../../common/src'
import { useIssueCompositeKey } from './use-issue-id'
import { useSettingsValue } from './use-settings'

export const selectImagePath = async (
    apiUrl: string,
    localIssueId: Issue['localId'],
    publishedIssueId: Issue['publishedId'],
    { source, path }: Image,
) => {
    const api = `${apiUrl}${APIPaths.media(
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

export const useImagePath = (image?: Image) => {
    const key = useIssueCompositeKey()

    const [path, setPath] = useState<string | undefined>()
    const apiUrl = useSettingsValue.apiUrl()
    useEffect(() => {
        if (key && image) {
            const { localIssueId, publishedIssueId } = key
            selectImagePath(apiUrl, localIssueId, publishedIssueId, image).then(
                setPath,
            )
        }
    }, [apiUrl, image, key])
    if (image === undefined) return undefined
    return path
}

export const useImagesPaths = (images: Image[]) => images.map(useImagePath)
