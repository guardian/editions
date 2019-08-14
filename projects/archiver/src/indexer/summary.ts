import { s3, bucket } from '../../s3'
import { upload } from '../../upload'
import { notNull } from '../../common'
import { attempt, hasFailed } from '../../../backend/utils/try'
import { groupBy } from 'ramda'
import { fromPairs } from 'ramda'

const zips = 'zips/'

export const generateIndex = async () => {
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

    const index = Object.entries(issues).map(([issue, filenames]) => {
        const dateFromIssue = new Date(issue)
        if (isNaN(dateFromIssue.getTime())) {
            console.warn(`Issue with path ${issue} is not a valid date`)
        }
        const date = isNaN(dateFromIssue.getTime()) ? new Date() : dateFromIssue
        return {
            key: issue,
            name: 'Daily Edition',
            date,
            assets: fromPairs(
                filenames.map(filename => {
                    const breakpoint = filename
                        .replace(issue, '')
                        .replace('.zip', '')
                        .replace('-', '')

                    if (breakpoint === '') return ['data', filename]
                    return [breakpoint, filename]
                }),
            ),
        }
    })

    return index
}

export const summary = async () => {
    const index = await attempt(generateIndex())
    if (hasFailed(index)) {
        console.error(index)
        console.error('Could not fetch index')
        return
    }
    await upload('issues', index, 'application/json')
    return
}
