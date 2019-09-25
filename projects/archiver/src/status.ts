import { upload } from './upload'
import { s3, Bucket } from './s3'
import { IssuePublicationIdentifier, notNull, IssueIdentifier } from '../../common/src'
import { getPublishedId, getLocalId } from './publishedId'
import { oc } from 'ts-optchain'

export type IssuePublicationWithStatus = IssuePublicationIdentifier & {
    status: Status
    updated: Date
}

export const publishedStatuses = [
    'published', // index file generated
    'notified', // notification sent
    'cleaned',
] as const
export const statuses = [
    ...publishedStatuses,
    'started', // started the process of building
    'built', // uploaded the zip file
    'unknown',
    'aborted',
] as const
export type Status = typeof statuses[number]

/* Given a published instance ID and status, store the provided status in S3
 * using a status.json file in S3 */
export const putStatus = (
    issuePublication: IssuePublicationIdentifier,
    status: Status,
) => {
    const publishedId = getPublishedId(issuePublication)
    const path = `${publishedId}/status.json`
    return upload(path, { status }, 'application/json', undefined)
}

/* Given a published instance ID of an issue, return the instance status
 * from the status.json file - this contains the status and modified time */
export const getStatus = async (
    issuePublication: IssuePublicationIdentifier,
): Promise<IssuePublicationWithStatus> => {
    const publishedId = getPublishedId(issuePublication)
    //get object
    const response = await s3
        .getObject({ Bucket, Key: `${publishedId}/status.json` })
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
): Promise<string[]> => {
    const root = getLocalId(issuePublication)
    const s3response = await s3
        .listObjectsV2({ Bucket, Delimiter: '/', Prefix: root })
        .promise()
    const versions = oc(s3response)
        .CommonPrefixes([])
        .map(_ => _.Prefix)
        .filter(notNull)
    return versions
}

/* Given an edition name and date provide a list of the status of each version
 * of that issue */
export const getStatuses = async (
    issuePublication: IssueIdentifier,
): Promise<IssuePublicationWithStatus[]> => {
    const allVersions = await getVersions(issuePublication)
    const publications = allVersions.map(version => ({
        ...issuePublication,
        version,
    }))
    return Promise.all(publications.map(getStatus))
}
