import { StepFunctions } from 'aws-sdk'
import { Handler } from 'aws-lambda'
export const stateMachineArnEnv = 'stateMachineARN' as const
const stateMachineArn = process.env[stateMachineArnEnv]
interface Record {
    s3: { bucket: { name: string }; object: { key: string } }
} //partial of https://docs.aws.amazon.com/AmazonS3/latest/dev/notification-content-structure.html
interface Issue {
    source: string
    id: string
}

const parseRecord = (record: Record): Issue => {
    const key = decodeURIComponent(record.s3.object.key)
    const [, id, filename] = key.split('/')
    if (filename === undefined || id === undefined) {
        throw new Error(`${key} does not correspond to an issue`)
    }
    const source = filename.replace('.json', '')
    return { source, id }
}

export const handler: Handler<
    {
        Records: Record[]
    },
    void
> = async ({ Records }) => {
    if (stateMachineArn == null) {
        throw new Error('No State Machine ARN configured')
    }

    const sf = new StepFunctions({
        region: 'eu-west-1',
    })

    const issues = Records.map(parseRecord)
    await sf
        .startExecution({
            stateMachineArn,
            input: JSON.stringify({
                issues,
            }),
        })
        .promise()
    return
}
