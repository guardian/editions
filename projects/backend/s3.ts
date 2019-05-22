import AWS, {
    S3,
    CredentialProviderChain,
    SharedIniFileCredentials,
    ChainableTemporaryCredentials,
} from 'aws-sdk'
AWS.config.credentials = new ChainableTemporaryCredentials({
    params: {
        RoleArn: process.env.arn as string,
        RoleSessionName: 'front-assume-role-access',
    },
})

const s3 = new S3({
    region: 'eu-west-1',
    // credentialProvider: new CredentialProviderChain([
    //     () => {
    //         const arn = process.env.arn
    //         console.log('ARN IS', arn)
    //         if (arn == null)
    //             return new SharedIniFileCredentials({ profile: 'cmsFronts' })
    //         return new ChainableTemporaryCredentials({
    //             params: {
    //                 RoleArn: arn,
    //                 RoleSessionName: 'front-assume-role-access',
    //             },
    //         })
    //     },
    // ]),
})

const stage = 'CODE'

type S3Response =
    | {
          status: number
          ok: false
      }
    | {
          status: number
          ok: true
          text: () => Promise<string>
          json: () => Promise<{}>
          lastModified?: Date
      }

export const s3fetch = (key: string): Promise<S3Response> => {
    const k = `${stage}/${key}`
    console.log(k, 'hello', process.env.arn)
    return new Promise((resolve, reject) => {
        s3.getObject(
            {
                Key: k,
                Bucket: 'facia-tool-store',
            },
            (error, result) => {
                console.log(error || 'NO ERROR')
                if (error && error.code == 'NoSuchKey') {
                    resolve({ status: 404, ok: false })
                    return
                }
                if (result == null) debugger
                if (error) reject(error)

                if (result == undefined) {
                    reject(new Error('No result!.'))
                    return
                }
                const body = result.Body

                if (body == undefined) {
                    reject(new Error('Not found.'))
                    return
                }

                resolve({
                    status: 200,
                    ok: true,
                    text: async () => body.toString(),
                    json: async () => JSON.parse(body.toString()),
                    lastModified: result.LastModified,
                })
            },
        )
    })
}
