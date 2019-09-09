import { s3, bucket } from '../s3'
import { upload } from '../upload'
import { notNull, IssueSummary } from '../../common'
import { attempt, hasFailed } from '../../../backend/utils/try'
import { groupBy } from 'ramda'
import { fromPairs } from 'ramda'
import { imageSizes, ImageSize, IssueId } from '../../../common/src'

const zips = 'zips/'

export const indexer = async (): Promise<IssueSummary[]> => {
    const objects = await s3
        .listObjectsV2({
            Bucket: bucket,
            Prefix: zips,
        })
        .promise()

    if (objects.Contents == null) throw new Error('No files in zip directory.')

    const keys = objects.Contents.map(_ => _.Key)

    const filenames = keys
        .filter(notNull)
        .map(key => key.substring(zips.length))
    const issues = groupBy<string>(filename => {
        return filename.split('.')[0]
    })(filenames)

    const index: IssueSummary[] = Object.entries(issues)
        .map(([issue, filenames]) => {
            const [id, source] = issue.split('_')
            const issueId: IssueId = { id, source, edition: 'daily-edition' }
            const dateFromIssue = new Date(id)
            if (isNaN(dateFromIssue.getTime())) {
                console.warn(`Issue with path ${issue} is not a valid date`)
                return null
            }

            const assetFiles = fromPairs(
                filenames
                    .map((filename): [ImageSize | 'data', string] | null => {
                        const [, breakpointString] = filename.split('.')

                        if (breakpointString === '') return ['data', filename]

                        const breakpoint = imageSizes.find(
                            size => size === breakpointString,
                        )
                        if (breakpoint === undefined) return null
                        return [breakpoint, filename]
                    })
                    .filter(notNull),
            )

            const images: { [key in ImageSize]?: string[] } = fromPairs(
                imageSizes
                    .map((breakpoint): [ImageSize, string[]] | null => {
                        const asset = assetFiles[breakpoint]
                        if (asset == null) return null
                        return [breakpoint, [asset]]
                    })
                    .filter(notNull),
            )

            const data = [assetFiles.data]
            if (data == null) {
                console.log(`No data for ${issue}`)
                return null
            }
            const assets = { data, ...images }

            return {
                key: issue,
                id: issueId,
                name: 'Daily Edition',
                date: dateFromIssue,
                assets,
            }
        })
        .filter(notNull)
        .sort((a, b) => b.date.getTime() - a.date.getTime())
        .slice(0, 7)
        .map(({ key, name, date, assets, id }) => ({
            key,
            name,
            id,
            date: date.toISOString(),
            assets,
        }))
    if (index === null) throw new Error("Couldn't generate index.")
    return index
}

export const summary = async () => {
    const index = await attempt(indexer())
    if (hasFailed(index)) {
        console.error(index)
        console.error('Could not fetch index')
        return
    }
    await upload('issues', index, 'application/json')
    return
}
