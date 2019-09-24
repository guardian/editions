import { upload, ONE_WEEK } from './upload'
import { s3, Bucket } from './s3'
import { IssuePublication, notNull } from '../../common/src'
import { getPublishedId, getLocalId } from './publishedId'
import { oc } from 'ts-optchain'
import { zipObj } from 'ramda'

export type IssuePublicationWithStatus = IssuePublication & {
    status: Status
    updated: Date
}

export const publishedStatuses = ['published', 'notified', 'cleaned'] as const
export const statuses = [
    ...publishedStatuses,
    'started',
    'built',
    'unknown',
    'aborted',
] as const
export type Status = typeof statuses[number]

export const putStatus = (
    issuePublication: IssuePublication,
    status: Status,
) => {
    const publishedId = getPublishedId(issuePublication)
    const path = `${publishedId}/status.json`
    return upload(path, { status }, 'application/json', ONE_WEEK)
}

export const getStatus = async (
    issuePublication: IssuePublication,
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

export const getVersions = async (
    issuePublication: Omit<IssuePublication, 'version'>,
) => {
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

export const getStatuses = async (
    issuePublication: Omit<IssuePublication, 'version'>,
): Promise<IssuePublicationWithStatus[]> => {
    const allVersions = await getVersions(issuePublication)
    const publications = allVersions.map(version => ({
        ...issuePublication,
        version,
    }))
    return Promise.all(publications.map(getStatus))
}
