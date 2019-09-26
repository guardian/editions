import { upload } from './upload'
import { s3, Bucket, listNestedPrefixes } from './s3'
import { IssuePublicationIdentifier, IssueIdentifier } from '../../common/src'
import { getPublishedId, getLocalId } from './publishedId'

export type IssuePublicationWithStatus = IssuePublicationIdentifier & {
    status: Status
    updated: Date
}

export const publishedStatuses = [
    'published', // zip file built and uploaded
    'indexed', // index file generated
    'notified', // notification sent
    'cleaned',
] as const
export const statuses = [
    ...publishedStatuses,
    'started', // started the process of building
    'assembled', // assembled assets into S3
    'unknown',
    'aborted',
] as const
export type Status = typeof statuses[number]

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
    const publishedId = getPublishedId(issuePublication)
    //get object
    const response = await s3
        .getObject({ Bucket, Key: `${publishedId}/status` })
        .promise()
    const statusResponse = response.Body
    if (typeof statusResponse !== 'string') {
        throw new Error('Could not get status')
    }
    const decodedStatus = JSON.parse(statusResponse)
    const status = statuses.find(_ => _ === decodedStatus.status) || 'unknown'
    const updated = response.LastModified || new Date(0)
    return { ...issuePublication, status, updated }
}

/* Given an edition name and date provide a list of versions */
export const getVersions = async (
    issuePublication: IssueIdentifier,
): Promise<IssuePublicationIdentifier[]> => {
    console.log(`getVersions for ${JSON.stringify(issuePublication)}`)
    const root = getLocalId(issuePublication)
    const versions = await listNestedPrefixes(Bucket, root)
    return versions.map(version => ({
        ...issuePublication,
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
