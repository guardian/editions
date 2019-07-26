import fetch from 'node-fetch'
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
import { attempt, Attempt, hasSucceeded } from '../backend/utils/try'

const URL =
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

export const getFront = async (issue: string, id: string) => {
    const path = `${URL}${frontPath(issue, id)}`
    const response = await fetch(path)
    return (await response.json()) as Front
}

export const getImage = async (
    issue: string,
    image: Image,
): Promise<[string, Attempt<Buffer>][]> => {
    const paths = imageSizes
        .filter(_ => _ !== 'sample') //don't keep the sample sized images no
        .map(size => mediaPath(issue, size, image.source, image.path))

    return Promise.all(
        paths
            .map((path): [string, Promise<Attempt<Buffer>>] => {
                const url = `${URL}${path}`
                const buffer = attempt(fetch(url).then(resp => resp.buffer()))
                return [path, buffer]
            })
            .map(
                async ([path, bufferPromise]): Promise<
                    [string, Attempt<Buffer>]
                > => {
                    const resolved = await bufferPromise
                    console.log(
                        `${
                            hasSucceeded(resolved)
                                ? 'successfully fetched'
                                : 'failed to download'
                        }  ${path}`,
                    )
                    return [path, resolved]
                },
            ),
    )
}

export const getColours = async (
    issue: string,
    image: Image,
): Promise<[string, Attempt<{}>]> => {
    const path = coloursPath(issue, image.source, image.path)
    return [path, await attempt(fetch(`${URL}${path}`).then(_ => _.json()))]
}
