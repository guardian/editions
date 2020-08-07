import { s3, listNestedPrefixes, upload, Bucket } from '../utils/s3'
import { IssuePublicationIdentifier, IssueIdentifier } from '../../common'
import { getPublishedId, getLocalId } from '../utils/path-builder'
import { oc } from 'ts-optchain'

export type IssuePublicationWithStatus = IssuePublicationIdentifier & {
    status: Status
    updated: Date
}

// prettier-ignore
export const publishedStatuses = [
    'bundled',              // zip files built and uploaded
    'proofed',              // index file generated in proof bucket
    'copied',               // copied across to publish bucket
    'published',            // index file generated in publish bucket
    'editionsListUpdated',  // editions list uploaded to proof or publish bucket
    'notified',             // notification sent
] as const

export const statuses = [
    ...publishedStatuses,
    'started', // started the process of building
    'assembled', // assembled assets into S3
    'errored',
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
    bucket: Bucket,
) => {
    console.log(
        `Changing state of ${JSON.stringify(issuePublication)} to ${status}`,
    )
    const publishedId = getPublishedId(issuePublication)
    const path = `${publishedId}/status`
    return upload(path, { status }, bucket, 'application/json', undefined)
}

/* Given a published instance ID of an issue, return the instance status
 * from the status file - this contains the status and modified time */
const getStatus = async (
    issuePublication: IssuePublicationIdentifier,
    bucket: Bucket,
): Promise<IssuePublicationWithStatus> => {
    console.log(`getStatus for ${JSON.stringify(issuePublication)}`)
    const publishedId = getPublishedId(issuePublication)
    //get object
    const response = await s3
        .getObject({ Bucket: bucket.name, Key: `${publishedId}/status` })
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
        return { ...issuePublication, status: 'errored', updated: new Date(0) }
    }
    const decodedStatus = JSON.parse(statusResponse)
    const status: Status =
        statuses.find(_ => _ === decodedStatus.status) || 'errored'
    const updated = oc(response).LastModified() || new Date(0)
    console.log(
        `Status for ${JSON.stringify(
            issuePublication,
        )} was ${status} at ${updated}`,
    )
    return { ...issuePublication, status, updated }
}

/* Given an edition name and date provide a list of versions */
const getVersions = async (
    issue: IssueIdentifier,
    bucket: Bucket,
): Promise<IssuePublicationIdentifier[]> => {
    console.log(`getVersions for ${JSON.stringify(issue)}`)
    const root = getLocalId(issue)
    const versions = await listNestedPrefixes(bucket, root)
    return versions.map(version => ({
        ...issue,
        version,
    }))
}

/* Given an edition name and date provide a list of the status of each version
 * of that issue */
export const getStatuses = async (
    issuePublication: IssueIdentifier,
    bucket: Bucket,
): Promise<IssuePublicationWithStatus[]> => {
    const allVersions: IssuePublicationIdentifier[] = await getVersions(
        issuePublication,
        bucket,
    )
    return Promise.all(allVersions.map(version => getStatus(version, bucket)))
}
