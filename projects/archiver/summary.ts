import { s3, bucket } from './s3'
import { notNull } from '../common/src'

export const generateIndex = async () => {
    const objects = await s3
        .listObjectsV2({
            Bucket: bucket,
            Delimiter: '/',
        })
        .promise()

    if (objects.CommonPrefixes == null) throw new Error('!')
    console.log(objects)
    const keys = objects.CommonPrefixes.map(_ => _.Prefix)
    const issues = keys
        .filter(notNull)
        .filter(_ => _ !== 'zips/')
        .map(_ => _.replace('/', ''))
        .map(key => {
            const date = new Date(key)
            if (isNaN(date.getTime())) {
                console.warn(`Issue with path ${key} is not a valid date`)
                return null
            }
            return { key, date }
        })
        .filter(notNull)
        .sort((a, b) => b.date.getTime() - a.date.getTime())
        .map(({ key, date }) => ({
            key,
            name: 'Daily Edition',
            date: date.toISOString(),
        }))
    return issues
}
