import { useEffect, useState } from 'react'
import RNFetchBlob from 'rn-fetch-blob'
import { imageForScreenSize } from 'src/helpers/screen'
import { APIPaths, FSPaths } from 'src/paths'
import { Image, Issue } from '../../../common/src'
import { useIssueCompositeKey } from './use-issue-id'
import { useSettingsValue } from './use-settings'

const selectImagePath = async (
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
 * A simple helper to get image paths.
 * This will asynchronously try the cache, otherwise will return the API url
 * if not available in the cache.
 *
 * Until the cache lookup has resolved, this will return undefined.
 * When the lookup resolves, a rerender should be triggered.
 *
 *  */

const useImagePath = (image?: Image) => {
    const key = useIssueCompositeKey()

    const [paths, setPaths] = useState<string | undefined>()
    const apiUrl = useSettingsValue.apiUrl()
    useEffect(() => {
        if (key && image) {
            const { localIssueId, publishedIssueId } = key
            selectImagePath(apiUrl, localIssueId, publishedIssueId, image).then(
                setPaths,
            )
        }
    }, [apiUrl, image, key])
    if (image === undefined) return undefined
    return paths
}

export { useImagePath, selectImagePath }
