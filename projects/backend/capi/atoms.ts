import {
    Lambda,
    ChainableTemporaryCredentials,
    SharedIniFileCredentials,
} from 'aws-sdk'
import { awsToString } from '../parser'
import { AtomElement } from '../common'

const lambda = new Lambda({
    region: 'eu-west-1',
    credentials: process.env.arn
        ? new ChainableTemporaryCredentials({
              params: {
                  RoleArn: process.env.arn as string,
                  RoleSessionName: 'front-assume-role-access',
              },
          })
        : new SharedIniFileCredentials({ profile: 'frontend' }),
})
const stage = process.env.stage || 'CODE'
export const renderAtom = async (
    atomType: string,
    atomId: string,
): Promise<{ html?: string; css: string[]; js: string[] } | null> => {
    let resp = await lambda
        .invoke({
            FunctionName: `editions-atom-renderer-${stage}`,
            Payload: JSON.stringify({
                atomType: atomType,
                id: atomId,
            }),
        })
        .promise()
    console.log(
        JSON.stringify({
            atomType: atomType,
            id: atomId,
        }),
    )
    const payload = awsToString(resp.Payload)
    if (!payload) return null
    const result = JSON.parse(JSON.parse(payload)) //FIXME: this is not good.
    return {
        html: result['html'],
        css: result['css'],
        js: result['js'],
    }
}
