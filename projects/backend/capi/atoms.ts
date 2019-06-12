import {
    Lambda,
    ChainableTemporaryCredentials,
    SharedIniFileCredentials,
} from 'aws-sdk'
import { awsToString } from '../parser'

const creds = process.env.arn
    ? {}
    : {
          credentials: new SharedIniFileCredentials({ profile: 'frontend' }),
      }

const lambda = new Lambda({
    region: 'eu-west-1',
    ...creds,
})
const stage = process.env.stage || 'CODE'
export const renderAtom = async (
    atomType: string,
    atomId: string,
): Promise<{ html?: string; css: string[]; js: string[] } | null> => {
    let resp = await lambda
        .invoke({
            FunctionName: process.env.atomArn || `editions-atom-renderer-CODE`,
            Payload: JSON.stringify({
                atomType: atomType,
                id: atomId,
            }),
        })
        .promise()

    const payload = awsToString(resp.Payload)
    if (!payload) return null
    const result = JSON.parse(JSON.parse(payload)) //FIXME: this is not good.
    return {
        html: result['html'],
        css: result['css'],
        js: result['js'],
    }
}
