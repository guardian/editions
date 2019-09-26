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

// from a list of S3 keys, create an object of the basename to filename
const identifyAssetFiles = (assetKeys: string[]) => {
    console.log('identifyAssetFiles', JSON.stringify(assetKeys))
    return fromPairs(
        assetKeys
            .map((key): [ImageSize | 'data', string] | null => {
                //get the name of the zip file by splitting into path segments
                //taking the last one
                //and removing the suffix
                const filename = key
                    .split('/')
                    .slice(-1)[0]
                    .replace('.zip', '')

                // special case the data bundle
                if (filename === 'data') {
                    return ['data', key]
                }

                // drop any unrecognised asset zips
                const breakpoint = imageSizes.find(size => size === filename)
                if (breakpoint === undefined) return null
                return [breakpoint, key]
            })
            .filter(notNull),
    )
}

// This mainly exists to narrow the type form and object to an object where the keys are ImageSize
const makeImageAssetObject = (assetFiles: {
    [key: string]: string
}): { [key in ImageSize]?: string } => {
    return fromPairs(
        imageSizes
            .map((size): [ImageSize, string] | null => {
                const asset = assetFiles[size]
                if (asset == null) return null
                return [size, asset]
            })
            .filter(notNull),
    )
}

/* Given an instance of an issue this returns a summary of the instance that
 * includes simple metadata (key, localId, etc) and the list of zip assets.
 * If the issue isn't valid this will return undefined.
 */
export const getIssueSummary = async (
    issuePublication: IssuePublicationIdentifier,
): Promise<IssueSummary | undefined> => {
    console.log('generating issue summary')
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

    console.log('assetKeys', JSON.stringify(assetKeys))

    const assetFiles = identifyAssetFiles(assetKeys)
    console.log('assetFiles extracted', JSON.stringify(assetFiles))

    const images = makeImageAssetObject(assetFiles)
    console.log('ImageAssetObjects extracted', JSON.stringify(images))

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
