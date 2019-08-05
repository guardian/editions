import fetch from 'node-fetch'
import {
    mediaPath,
    coloursPath,
    issuePath,
    frontPath,
    Issue,
    Front,
    Image,
} from './common'
import {
    attempt,
    Attempt,
    hasFailed,
    withFailureMessage,
} from '../backend/utils/try'
import { ImageSize } from '../common/src'

export const URL =
    process.env.backend !== undefined
        ? `https://${process.env.backend}`
        : 'http://localhost:3131/'

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

export const getImage = async (
    source: string,
    issue: string,
    image: Image,
    size: ImageSize,
): Promise<[string, Attempt<Buffer>]> => {
    const path = mediaPath(issue, size, image.source, image.path)

    const url = `${URL}${source}/${path}`
    const resp = attempt(fetch(url))

    const maybeResponse = await resp

    if (hasFailed(maybeResponse)) return [path, maybeResponse]

    return [path, await maybeResponse.buffer()]
}

export const getColours = async (
    source: string,
    issue: string,
    image: Image,
): Promise<[string, Attempt<{}>]> => {
    const path = coloursPath(issue, image.source, image.path)
    const url = `${URL}${source}/${path}`
    const response = await attempt(fetch(url).then(_ => _.json()))
    return [path, response]
}
