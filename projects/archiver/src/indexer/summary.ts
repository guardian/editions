import { fromPairs, groupBy } from 'ramda'
import { attempt, hasFailed } from '../../../backend/utils/try'
import { ImageSize, imageSizes, IssuePublication } from '../../../common/src'
import { IssueSummary, notNull } from '../../common'
import { bucket, s3 } from '../s3'
import { upload } from '../upload'

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
        return filename
            .split('/')
            .slice(0, 3)
            .join('/')
    })(filenames)

    const index: IssueSummary[] = Object.entries(issues)
        .map(([issue, filenames]) => {
            const [edition, id, source] = issue.split('/')

            const dateFromIssue = new Date(id)
            if (isNaN(dateFromIssue.getTime())) {
                console.warn(`Issue with path ${issue} is not a valid date`)
                return null
            }

            const assetFiles = fromPairs(
                filenames
                    .map((filename): [ImageSize | 'data', string] | null => {
                        const [, , , breakpointString] = filename
                            .replace('.zip', '')
                            .split('/')

                        if (breakpointString === 'data') {
                            return ['data', filename]
                        }

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
            const key = `${edition}/${id}`
            const localId = key
            const publishedId = `${key}/${source}`
            return {
                key,
                localId,
                publishedId,
                name: 'Daily Edition',
                date: dateFromIssue,
                assets,
            }
        })
        .filter(notNull)
        .sort((a, b) => b.date.getTime() - a.date.getTime())
        .slice(0, 7)
        .map(({ name, date, assets, key, localId, publishedId }) => ({
            key,
            localId,
            publishedId,
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
    await upload('issues', index, 'application/json')
    return
}
