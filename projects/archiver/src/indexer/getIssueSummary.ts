import { fromPairs } from 'ramda'
import { oc } from 'ts-optchain'
import {
    IssuePublicationIdentifier,
    IssueSummary,
    ImageSize,
    imageSizes,
    notNull,
} from '../../../common/src'
import { getPublishedId } from '../publishedId'
import { Bucket, s3 } from '../s3'
import { issue } from '../../main'

/* Given an instance of an issue this returns a summary of the instance that
 * includes simple metadata (key, localId, etc) and the list of zip assets
 */
export const getIssueSummary = async (
    issuePublication: IssuePublicationIdentifier,
): Promise<IssueSummary | undefined> => {
    const { edition, issueDate } = issuePublication

    const publishedId = getPublishedId(issuePublication)

    const assetKeyList = await s3
        .listObjectsV2({
            Bucket,
            Prefix: `zips/${publishedId}/`,
        })
        .promise()

    const assetKeys = oc(assetKeyList)
        .Contents([])
        .map(_ => _.Key)
        .filter(notNull)

    const dateFromIssue = new Date(issueDate)

    if (isNaN(dateFromIssue.getTime())) {
        console.warn(`Issue with path ${issueDate} is not a valid date`)
        return undefined
    }

    const assetFiles = fromPairs(
        assetKeys
            .map((key): [ImageSize | 'data', string] | null => {
                //get the name of the zip file by splitting into path segments
                //taking the last one
                //and removing the suffix
                const filename = key
                    .split('/')
                    .slice(-1)[0]
                    .replace('.zip', '')

                if (filename === 'data') {
                    return ['data', key]
                }

                const breakpoint = imageSizes.find(size => size === filename)
                if (breakpoint === undefined) return null
                return [breakpoint, key]
            })
            .filter(notNull),
    )

    const images: { [key in ImageSize]?: string } = fromPairs(
        imageSizes
            .map((breakpoint): [ImageSize, string] | null => {
                const asset = assetFiles[breakpoint]
                if (asset == null) return null
                return [breakpoint, asset]
            })
            .filter(notNull),
    )

    const data = assetFiles.data
    if (data == null) {
        console.log(`No data for ${issue}`)
        return undefined
    }
    const assets = { data, ...images }
    const localId = `${edition}/${issueDate}`
    const key = localId
    return {
        key,
        localId,
        publishedId,
        name: 'Daily Edition',
        date: issueDate,
        assets,
    }
}
