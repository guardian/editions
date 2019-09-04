import { Handler } from 'aws-lambda'
import { oc } from 'ts-optchain'
import { IssueParams } from './issueTask'
import { s3, bucket } from './s3'
import { DeleteObjectsRequest } from 'aws-sdk/clients/s3'
import { notNull } from '../../common/src'

interface DeleteTaskOutput extends IssueParams {
    filesRemaining: number
    keysDeleted: string[]
}

export const handler: Handler<IssueParams, DeleteTaskOutput> = async ({
    issueId,
}) => {
    //get issue files
    const { Contents, MaxKeys, KeyCount } = await s3
        .listObjectsV2({
            Bucket: bucket,
            Prefix: issueId.id,
        })
        .promise()
    if (KeyCount == 0) return { issueId, filesRemaining: 0, keysDeleted: [] }
    const uncounted = KeyCount == MaxKeys ? 1 : 0 // Add an extra file to delete if we have more keys than listobject is ok with
    if (
        Contents == undefined ||
        KeyCount == undefined ||
        MaxKeys == undefined
    ) {
        throw new Error('S3 error')
    }
    const Objects = Contents.map(({ Key }) => Key)
        .filter(notNull)
        .map(Key => ({ Key }))
    console.warn('About to delete')
    console.log(JSON.stringify(Objects))
    const params: DeleteObjectsRequest = {
        Bucket: bucket,
        Delete: { Objects },
    }
    const deletion = await s3.deleteObjects(params).promise()
    if (deletion.Errors && deletion.Errors.length !== 0) {
        console.error('deletion failed with errors')
        console.error(JSON.stringify(deletion.Errors))
        throw new Error('Delete failed')
    }
    const deletedCount = oc(deletion).Deleted.length(0)

    console.log('Deleted')
    console.log(JSON.stringify(deletion))
    return {
        issueId,
        filesRemaining: KeyCount - deletedCount + uncounted,
        keysDeleted: oc(deletion)
            .Deleted([])
            .map(_ => _.Key || ''),
    }
}
