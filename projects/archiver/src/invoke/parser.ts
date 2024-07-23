import {
    Attempt,
    failure,
    IssuePublicationActionIdentifier,
} from '../../common'
import { GetS3ObjParams } from '../utils/s3'
import { Record } from '.'
import { EditionListPublicationAction } from '../../common'

const isValidJSON = (s: string): boolean => {
    try {
        JSON.parse(s)
    } catch (e) {
        return false
    }
    return true
}

export const parseIssueActionRecordInternal = (
    objContent: string,
    loc = '',
): Attempt<IssuePublicationActionIdentifier> => {
    if (!isValidJSON(objContent)) {
        return failure({
            error: new Error(),
            messages: [`⚠️ JSON malformed in ${loc} file`],
        })
    }

    const {
        action,
        edition,
        version,
        issueDate,
        notificationUTCOffset,
        topic,
    } = JSON.parse(objContent) as IssuePublicationActionIdentifier

    if (
        action === undefined ||
        edition === undefined ||
        version === undefined ||
        issueDate === undefined ||
        notificationUTCOffset === undefined ||
        topic === undefined
    ) {
        return failure({
            error: new Error(),
            messages: [
                `⚠️ ${loc} json file with issue details did not contained required values: (action, edition, version, issueDate, notificationUTCOffset, topic)`,
            ],
        })
    }
    return { action, edition, version, issueDate, notificationUTCOffset, topic }
}

const parseEditionListActionRecordInternal = (
    objContent: string,
    loc = '',
): Attempt<EditionListPublicationAction> => {
    if (!isValidJSON(objContent)) {
        return failure({
            error: new Error(),
            messages: [`⚠️ JSON malformed in ${loc} file`],
        })
    }

    const { action, content } = JSON.parse(
        objContent,
    ) as EditionListPublicationAction

    if (action === undefined || content === undefined) {
        return failure({
            error: new Error(),
            messages: [
                `⚠️ ${loc} json file with edition list details did not contained required values: (action, content)`,
            ],
        })
    }
    return { action, content }
}

async function fetchFromS3(
    record: Record,
    s3fetch: (params: GetS3ObjParams) => Promise<string>,
) {
    console.log('Starting to parse record')
    const bucket = record.s3.bucket.name
    const key = decodeURIComponent(record.s3.object.key)

    const objContent = await s3fetch({ Bucket: bucket, Key: key })

    const loc = `s3://${bucket}/${key}`

    console.log(`got object content from ${loc} location:`, objContent)
    return { objContent, loc }
}

export const parseEditionListActionRecord = async (
    record: Record,
    s3fetch: (params: GetS3ObjParams) => Promise<string>,
): Promise<Attempt<EditionListPublicationAction>> => {
    const { objContent, loc } = await fetchFromS3(record, s3fetch)
    return parseEditionListActionRecordInternal(objContent, loc)
}

export const parseIssueActionRecord = async (
    record: Record,
    s3fetch: (params: GetS3ObjParams) => Promise<string>,
): Promise<Attempt<IssuePublicationActionIdentifier>> => {
    const { objContent, loc } = await fetchFromS3(record, s3fetch)

    return parseIssueActionRecordInternal(objContent, loc)
}
