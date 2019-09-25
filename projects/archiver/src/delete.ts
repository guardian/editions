import { IssuePublicationIdentifier, notNull } from '../common'
import { s3, Bucket } from './s3'
import { getPublishedId } from './publishedId'
const deleteWithPrefix = async (Prefix: string): Promise<void> => {
    const resp = await s3
        .listObjectsV2({
            Bucket,
            Prefix,
        })
        .promise()
    if (resp.KeyCount == 0) return
    const keys = (resp.Contents || []).map(({ Key }) => Key).filter(notNull)
    console.log('Deleting')
    console.log(JSON.stringify(keys))
    const Objects = keys.map(Key => ({ Key }))
    await s3.deleteObjects({ Bucket, Delete: { Objects } }).promise()
    return deleteWithPrefix(Prefix)
}

export const deletePublication = async (
    issuePublication: IssuePublicationIdentifier,
) => {
    console.log(`About to delete ${JSON.stringify(issuePublication)}`)
    const publishedId = getPublishedId(issuePublication)
    const zipPath = `zips/${publishedId}`
    await deleteWithPrefix(zipPath)
    await deleteWithPrefix(publishedId)
}
