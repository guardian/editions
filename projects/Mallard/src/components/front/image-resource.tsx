import React, { useState } from 'react'
import { FSPaths, APIPaths } from 'src/paths'
import { Image as IImage } from '../../../../common/src'
import { Image, StyleProp, ImageStyle } from 'react-native'

// get the tail of an array, use in setPath, to move on to the next path after an error
const tail = <T extends any>([, ...next]: T[]): T[] => next

/**
 * This component abstracts away the endpoint for images
 *
 * Bascially it will try to go to the filesystem and if it fails will
 * go to the API
 *
 * This had been implemented using RNFetchBlob.fs.exists, but it's just as slow
 * as this implementation for API calls and seems slower for cache hits
 */
const ImageResource = ({
    issueID,
    image: { source, path },
    style,
}: {
    issueID: string
    image: IImage
    style?: StyleProp<ImageStyle>
}) => {
    const [paths, setPaths] = useState([
        FSPaths.media(issueID, source, path),
        `${APIPaths.mediaBackend}${APIPaths.media(
            issueID,
            'phone', // todo, use the proper one!
            source,
            path,
        )}`,
    ])

    const handleError = () => setPaths(tail)

    // this might be undefined if the API errors
    // this is sort of fine but may want to handle this better
    const currPath = paths[0]

    return (
        <Image style={style} source={{ uri: currPath }} onError={handleError} />
    )
}

export { ImageResource }
