import { s3, Bucket, listNestedPrefixes, upload } from '../utils/s3'
import { IssuePublicationIdentifier, IssueIdentifier } from '../../common'
import { getPublishedId, getLocalId } from '../utils/path-builder'
import { oc } from 'ts-optchain'

export type IssuePublicationWithStatus = IssuePublicationIdentifier & {
    status: Status
    updated: Date
}

export const publishedStatuses = [
    'bundled', // zip files built and uploaded
    'indexed', // index file generated
    'notified', // notification sent
] as const
export const statuses = [
    ...publishedStatuses,
    'started', // started the process of building
    'assembled', // assembled assets into S3
    'unknown',
] as const
export type Status = typeof statuses[number]

export const isPublished = (status: Status): boolean => {
    return (publishedStatuses as readonly Status[]).includes(status)
}

/* Given a published instance ID and status, store the provided status in S3
 * using a status file in S3 */
export const putStatus = (
    issuePublication: IssuePublicationIdentifier,
    status: Status,
) => {
    console.log(
        `Changing state of ${JSON.stringify(issuePublication)} to ${status}`,
    )
    const publishedId = getPublishedId(issuePublication)
    const path = `${publishedId}/status`
    return upload(path, { status }, 'application/json', undefined)
}

/* Given a published instance ID of an issue, return the instance status
 * from the status file - this contains the status and modified time */
export const getStatus = async (
    issuePublication: IssuePublicationIdentifier,
): Promise<IssuePublicationWithStatus> => {
    console.log(`getStatus for ${JSON.stringify(issuePublication)}`)
    const publishedId = getPublishedId(issuePublication)
    //get object
    const response = await s3
        .getObject({ Bucket, Key: `${publishedId}/status` })
        .promise()
        .catch(() => {
            return undefined
        })
    const statusResponse =
        response && response.Body && response.Body.toString('utf-8')
    console.log(
        `Raw response for ${JSON.stringify(
            issuePublication,
        )} is ${statusResponse}`,
    )
    if (typeof statusResponse !== 'string') {
        console.log(
            `Raw response for ${JSON.stringify(
                issuePublication,
            )} was not a string :( but was actually a ${typeof statusResponse}`,
        )
        return { ...issuePublication, status: 'unknown', updated: new Date(0) }
    }
    const decodedStatus = JSON.parse(statusResponse)
    const status = statuses.find(_ => _ === decodedStatus.status) || 'unknown'
    const updated = oc(response).LastModified() || new Date(0)
    console.log(
        `Status for ${JSON.stringify(
            issuePublication,
        )} was ${status} at ${updated}`,
    )
    return { ...issuePublication, status, updated }
}

/* Given an edition name and date provide a list of versions */
export const getVersions = async (
    issue: IssueIdentifier,
): Promise<IssuePublicationIdentifier[]> => {
    console.log(`getVersions for ${JSON.stringify(issue)}`)
    const root = getLocalId(issue)
    const versions = await listNestedPrefixes(Bucket, root)
    return versions.map(version => ({
        ...issue,
        version,
    }))
}

/* Given an edition name and date provide a list of the status of each version
 * of that issue */
export const getStatuses = async (
    issuePublication: IssueIdentifier,
): Promise<IssuePublicationWithStatus[]> => {
    const allVersions = await getVersions(issuePublication)
    return Promise.all(allVersions.map(getStatus))
}
