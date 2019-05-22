import AWS, {
    S3,
    CredentialProviderChain,
    SharedIniFileCredentials,
    ChainableTemporaryCredentials,
} from 'aws-sdk'

const s3 = new S3({
    region: 'eu-west-1',
    credentialProvider: new CredentialProviderChain([
        () => {
            const arn = process.env.arn
            if (arn == null)
                return new SharedIniFileCredentials({ profile: 'cmsFronts' })
            return new ChainableTemporaryCredentials({
                params: {
                    RoleArn: arn,
                    RoleSessionName: 'front-assume-role-access',
                },
            })
        },
        ...AWS.CredentialProviderChain.defaultProviders,
    ]),
})

const stage = 'PROD'

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
    console.log(k)
    return new Promise((resolve, reject) => {
        s3.getObject(
            {
                Key: k,
                Bucket: 'facia-tool-store',
            },
            (error, result) => {
                if (error && error.code == 'NoSuchKey') {
                    resolve({ status: 404, ok: false })
                    return
                }
                if (result == null) debugger
                if (error) reject(error)

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
