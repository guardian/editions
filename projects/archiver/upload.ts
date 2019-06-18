import { S3, SharedIniFileCredentials } from 'aws-sdk'

const creds = process.env.arn
    ? {}
    : {
          credentials: new SharedIniFileCredentials({ profile: 'frontend' }),
      }
const s3 = new S3({
    region: 'eu-west-1',
    ...creds,
})

export const uploadForIssue = (issue: string) => (
    key: string,
    body: {},
): Promise<unknown> => {
    return s3
        .putObject({
            Body: JSON.stringify(body),
            Bucket: 'editions-store',
            Key: `issue/${issue}/${key}`,
            ACL: 'public-read',
        })
        .promise()
}
