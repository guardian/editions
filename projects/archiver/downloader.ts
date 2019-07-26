import fetch, { Response } from 'node-fetch'
import {
    mediaPath,
    coloursPath,
    imageSizes,
    issuePath,
    frontPath,
    Issue,
    Front,
    Image,
} from './common'
import {
    attempt,
    Attempt,
    hasSucceeded,
    hasFailed,
    withFailureMessage,
} from '../backend/utils/try'
import { PassThrough, Readable } from 'stream'
import { ImageSize } from '../common/src'

export const URL = 'https://d2cf1ljtg904cv.cloudfront.net/'
// process.env.backend !== undefined
//     ? `https://${process.env.backend}`
//     : 'http://localhost:3131/'

export const getIssue = async (id: string) => {
    const path = `${URL}${issuePath(id)}`
    console.log('fetching!', path)
    const response = await fetch(path)
    console.log(response.status)
    const json = await response.json()
    console.log(json)
    return json as Issue
}

export const getFront = async (
    issue: string,
    id: string,
): Promise<Attempt<[string, Front]>> => {
    const path = `${URL}${frontPath(issue, id)}`
    const response = await fetch(path)
    const maybeFront = await attempt(response.json() as Promise<Front>)
    if (hasFailed(maybeFront))
        return withFailureMessage(
            maybeFront,
            `Failed to download front ${id} from ${issue}`,
        )
    return [id, maybeFront]
}

export const getImages = async (
    issue: string,
    image: Image,
): Promise<[string, Attempt<Readable>][]> => {
    const paths = imageSizes.map(size =>
        mediaPath(issue, size, image.source, image.path),
    )

    return Promise.all(
        paths
            .map((path): [string, Promise<Attempt<Response>>] => {
                const url = `${URL}${path}`
                const resp = attempt(fetch(url))
                return [path, resp]
            })
            .map(
                async ([path, promiseMaybeResponse]): Promise<
                    [string, Attempt<Readable>]
                > => {
                    const maybeResponse = await promiseMaybeResponse

                    if (hasFailed(maybeResponse)) return [path, maybeResponse]
                    const stream = new PassThrough()

                    maybeResponse.body.pipe(stream)

                    return [path, stream]
                },
            ),
    )
}

export const getImage = async (
    issue: string,
    image: Image,
    size: ImageSize,
): Promise<[string, Attempt<Buffer>]> => {
    const path = mediaPath(issue, size, image.source, image.path)

    const url = `${URL}${path}`
    const resp = attempt(fetch(url))

    const maybeResponse = await resp

    if (hasFailed(maybeResponse)) return [path, maybeResponse]

    return [path, await maybeResponse.buffer()]
}

export const getColours = async (
    issue: string,
    image: Image,
): Promise<[string, Attempt<{}>]> => {
    const path = coloursPath(issue, image.source, image.path)
    return [path, await attempt(fetch(`${URL}${path}`).then(_ => _.json()))]
}
