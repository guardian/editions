import AWS, {S3, CredentialProviderChain, SharedIniFileCredentials } from 'aws-sdk'

const s3 = new S3({
    region: "eu-west-1",
    credentialProvider: new CredentialProviderChain([
        () => new SharedIniFileCredentials({ profile: "cmsFronts" }),
      ...AWS.CredentialProviderChain.defaultProviders,
    ])
  });

const stage = 'CODE'

export const s3fetch = async (key: string) => {
    const k = `${stage}/${key}`
    console.log(k)
    const result = await s3.getObject({
        Key: k,
        Bucket: 'facia-tool-store'
    }).promise()
    const body = result.Body
    if(body == null) throw new Error("Not found.")
    return {
        text: async ()=>body.toString(),
        json: async ()=>JSON.parse(body.toString()),
        lastModified: result.LastModified
    }
}
