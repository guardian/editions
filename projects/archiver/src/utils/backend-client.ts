import fetch from 'node-fetch'
import {
    issuePath,
    frontPath,
    Issue,
    Front,
    Image,
    ImageSize,
    imagePath,
    ImageUse,
} from '../../common'
import {
    attempt,
    Attempt,
    hasFailed,
    withFailureMessage,
} from '../../../backend/utils/try'

export const URL =
    process.env.backend !== undefined
        ? `https://${process.env.backend}`
        : 'http://localhost:3131/'

export const getIssue = async (publishedId: string) => {
    const path = `${URL}${issuePath(publishedId)}`
    console.log('fetching!', path)
    const response = await fetch(path)
    console.log(response.status)
    const json = await response.json()
    console.log(json)
    return json as Issue
}

export const getFront = async (
    publishedId: string,
    front: string,
): Promise<Attempt<Front>> => {
    const path = `${URL}${frontPath(publishedId, front)}`
    console.log(`attempt to getFront from path: ${path}`)
    const response = await fetch(path)
    const maybeFront = await attempt(response.json() as Promise<Front>)
    if (hasFailed(maybeFront))
        return withFailureMessage(
            maybeFront,
            `Failed to download front ${front} from ${publishedId}`,
        )
    return maybeFront
}

export const getImageUse = async (
    publishedId: string,
    image: Image,
    size: ImageSize,
    use: ImageUse,
): Promise<[string, Attempt<Buffer>]> => {
    const path = imagePath(publishedId, size, image, use)

    const url = `${URL}/${path}`
    const resp = attempt(fetch(url))

    const maybeResponse = await resp

    if (hasFailed(maybeResponse)) return [path, maybeResponse]

    return [path, await maybeResponse.buffer()]
}
