import { Attempt, failure, IssuePublicationIdentifier } from '../../common'
import { GetS3ObjParams } from '../utils/s3'
import { Record } from '.'

const isValidJSON = (s: string): boolean => {
    try {
        JSON.parse(s)
    } catch (e) {
        return false
    }
    return true
}

export const parseRecordInternal = (
    objContent: string,
    loc = '',
): Attempt<IssuePublicationIdentifier> => {
    if (!isValidJSON(objContent)) {
        return failure({
            error: new Error(),
            messages: [`⚠️ JSON malformed in ${loc} file`],
        })
    }

    const { edition, version, issueDate } = JSON.parse(objContent)

    if (
        edition === undefined ||
        version === undefined ||
        issueDate === undefined
    ) {
        return failure({
            error: new Error(),
            messages: [
                `⚠️ ${loc} json file with issue details did not contained requiered fileds: (edition, version, issueDate)`,
            ],
        })
    }
    return { edition, version, issueDate }
}

export const parseRecord = async (
    record: Record,
    s3fetch: (params: GetS3ObjParams) => Promise<string>,
): Promise<Attempt<IssuePublicationIdentifier>> => {
    console.log('Starting to parse record')
    const bucket = record.s3.bucket.name
    const key = decodeURIComponent(record.s3.object.key)

    const objContent = await s3fetch({ Bucket: bucket, Key: key })

    const loc = `s3://${bucket}/${key}`

    console.log(`got object content from ${loc} location:`, objContent)

    return parseRecordInternal(objContent, loc)
}
