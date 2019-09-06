import fetch from 'node-fetch'
import {
    mediaPath,
    coloursPath,
    issuePath,
    frontPath,
    Issue,
    Front,
    Image,
} from '../common'
import {
    attempt,
    Attempt,
    hasFailed,
    withFailureMessage,
} from '../../backend/utils/try'
import { ImageSize, IssueId } from '../../common/src'

export const URL =
    process.env.backend !== undefined
        ? `https://${process.env.backend}`
        : 'http://localhost:3131/'

export const getIssue = async (issue: IssueId) => {
    const path = `${URL}${issuePath(issue)}`
    console.log('fetching!', path)
    const response = await fetch(path)
    console.log(response.status)
    const json = await response.json()
    console.log(json)
    return json as Issue
}

export const getFront = async (
    issue: IssueId,
    front: string,
): Promise<Attempt<Front>> => {
    const path = `${URL}${frontPath(issue, front)}`
    const response = await fetch(path)
    const maybeFront = await attempt(response.json() as Promise<Front>)
    if (hasFailed(maybeFront))
        return withFailureMessage(
            maybeFront,
            `Failed to download front ${front} from ${issue}`,
        )
    return maybeFront
}

export const getImage = async (
    issue: IssueId,
    image: Image,
    size: ImageSize,
): Promise<[string, Attempt<Buffer>]> => {
    const path = mediaPath(issue, size, image.source, image.path)

    const url = `${URL}/${path}`
    const resp = attempt(fetch(url))

    const maybeResponse = await resp

    if (hasFailed(maybeResponse)) return [path, maybeResponse]

    return [path, await maybeResponse.buffer()]
}

export const getColours = async (
    issue: IssueId,
    image: Image,
): Promise<[string, Attempt<{}>]> => {
    const path = coloursPath(issue, image.source, image.path)
    const url = `${URL}/${path}`
    const response = await attempt(fetch(url).then(_ => _.json()))
    return [path, response]
}
