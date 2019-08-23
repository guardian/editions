import { S3 } from 'aws-sdk'

export const s3 = new S3({
    region: 'eu-west-1',
})

export const bucket = process.env.bucket || 'editions-store-code'
