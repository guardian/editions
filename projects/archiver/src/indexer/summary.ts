import { s3, bucket } from '../s3'
import { upload } from '../upload'
import { notNull, IssueSummary } from '../../common'
import { attempt, hasFailed } from '../../../backend/utils/try'
import { groupBy } from 'ramda'
import { fromPairs } from 'ramda'
import { imageSizes, ImageSize } from '../../../common/src'

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
        const issue = filename.match(/\d\d\d\d-\d\d-\d\d/)
        if (issue == null) return '??'
        return issue[0]
    })(filenames)

    const index: IssueSummary[] = Object.entries(issues)
        .map(([issue, filenames]) => {
            const dateFromIssue = new Date(issue)
            if (isNaN(dateFromIssue.getTime())) {
                console.warn(`Issue with path ${issue} is not a valid date`)
                return null
            }

            const assetFiles = fromPairs(
                filenames
                    .map((filename): [ImageSize | 'data', string] | null => {
                        const breakpointString = filename
                            .replace(issue, '')
                            .replace('.zip', '')
                            .replace('-', '')

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
                name: 'Daily Edition',
                date: dateFromIssue,
                assets,
            }
        })
        .filter(notNull)
        .sort((a, b) => b.date.getTime() - a.date.getTime())
        .slice(0, 7)
        .map(({ key, name, date, assets }) => ({
            key,
            name,
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
    await upload('issues', index, 'application/json', 'index')
    return
}
