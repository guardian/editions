import { useEffect, useState } from 'react'
import { Image, ImageUse } from '../../../Apps/common/src'
import { selectImagePath } from './use-image-paths'

type ImageData = { key: string; image: Image; use: ImageUse }
type ImagePaths = Map<string, string>

type ImagePathsState =
    | { type: 'none' }
    | { type: 'collect'; images: ImageData[] }
    | { type: 'resolve'; paths: ImagePaths }

const NO_STATE: ImagePathsState = { type: 'none' }
let IMAGE_PATHS_STATE: ImagePathsState = NO_STATE

/**
 * Similar to `useImagePath` but for use from the code that builds the HTML.
 */
export const collectImagePath = (
    image?: Image,
    use: ImageUse = 'full-size',
): string | undefined => {
    if (image == null) return undefined
    if (IMAGE_PATHS_STATE.type === 'none')
        throw new Error(
            '`getImagePath` calls must be wrapped in ' +
                '`useCollectedImagePaths` or `renderWithImagePaths`',
        )

    const key = JSON.stringify([image, use])
    if (IMAGE_PATHS_STATE.type === 'collect') {
        IMAGE_PATHS_STATE.images.push({ key, image, use })
        return undefined
    }

    return IMAGE_PATHS_STATE.paths.get(key)
}

/**
 * Collect the list of all the images used by the `renderer`, then fetch the
 * relevant image file paths, and eventually return these. Return `null` while
 * we're still resolving the file paths. `renderer` should have no side effect,
 * much like a React render function.
 */
export const useCollectedImagePaths = <R>(
    apiUrl: string | null,
    localIssueId: string,
    publishedIssueId: string,
    renderer: () => R,
): ImagePaths | undefined => {
    const [imagePaths, setImagePaths] = useState<ImagePaths | undefined>(
        undefined,
    )
    useEffect(() => {
        if (apiUrl == null) return
        let localSetPaths = setImagePaths
        const images: ImageData[] = []

        try {
            IMAGE_PATHS_STATE = { type: 'collect', images }
            renderer()
        } finally {
            IMAGE_PATHS_STATE = NO_STATE
        }

        const getImagePath = async (imageData: ImageData) => {
            const path = await selectImagePath(
                apiUrl,
                localIssueId,
                publishedIssueId,
                imageData.image,
                imageData.use,
            )
            return [imageData.key, path]
        }
        ;(async () => {
            const paths = await Promise.all(images.map(getImagePath))
            // `Promise.all` isn't fully correctly typed, we have to use `any`
            localSetPaths(new Map(paths as any))
        })()

        return () => void (localSetPaths = () => {})
    }, [apiUrl, localIssueId, publishedIssueId, renderer])

    return imagePaths
}

/**
 * Run `renderer` with inner calls to `collectImagePath` resolving to the
 * correct image paths. If `imagePaths` is `null` (ex. still loading), then
 * we don't try to render anything yet.
 */
export const renderWithImagePaths = <R>(
    renderer: () => R,
    imagePaths: ImagePaths | undefined,
) => {
    if (imagePaths == null) return null
    try {
        IMAGE_PATHS_STATE = { type: 'resolve', paths: imagePaths }
        return renderer()
    } finally {
        IMAGE_PATHS_STATE = NO_STATE
    }
}
