require('dotenv').config()

import { Handler } from 'aws-lambda'
import { getIssue, getCollection, getFront } from './downloader'
import { attempt, hasFailed, hasSucceeded, Attempt } from '../backend/utils/try'
import { Front, Collection } from './common'
import { uploadForIssue } from './upload'
import { zipIssue } from './zipper'

const run = async (id: string): Promise<void> => {
    console.log('Attempting to download issue.')
    const issue = await attempt(getIssue(id))
    if (hasFailed(issue)) throw new Error('OH NO')
    console.log('Downloaded issue', id)
    const upload = uploadForIssue(id)
    const maybeFronts = await Promise.all(
        issue.fronts.map(
            async (frontid): Promise<[string, Attempt<Front>]> => [
                frontid,
                await attempt(getFront(frontid)),
            ],
        ),
    )
    maybeFronts.forEach(([id, attempt]) => {
        if (hasFailed(attempt)) {
            console.warn(`Front ${id} failed with ${attempt.error}`)
        }
    })

    console.log('Fetched fronts')
    const collectionids = ([] as string[]).concat(
        ...maybeFronts.map(([id, front]) => {
            if (hasSucceeded(front)) {
                return front.collections
            }
            return []
        }),
    )

    const maybeCollections = await Promise.all(
        collectionids.map(
            async (id): Promise<[string, Attempt<Collection>]> => [
                id,
                await attempt(getCollection(id)),
            ],
        ),
    )
    console.log('Fetched collections')

    await Promise.all(
        maybeCollections.map(async ([id, maybeCollection]) => {
            if (hasSucceeded(maybeCollection)) {
                await upload(`collection/${id}`, maybeCollection)
            }
        }),
    )

    console.log('Uploaded collections')

    await Promise.all(
        maybeFronts.map(async ([id, maybeFront]) => {
            if (hasSucceeded(maybeFront)) {
                await upload(`front/${id}`, maybeFront)
            }
        }),
    )

    console.log('Uploaded fronts')

    await upload(`issue`, issue)
    console.log('Uploaded issue.')
    console.log('Compressing')
    await zipIssue(id)
    console.log('Zip uploaded')
}

if (require.main === module) {
    run('alpha-edition').then(() => {})
    // while (!done) {}
}

export const handler: Handler<{ id?: string }, void> = async event => {
    const id = event.id
    if (!(id && typeof id === 'string')) throw new Error('Nope')
    return run(id)
}
