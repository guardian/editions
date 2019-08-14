import { S3 } from 'aws-sdk'

export const s3 = new S3({
    region: 'eu-west-1',
    // credentialProvider: new CredentialProviderChain([
    //     () => new SharedIniFileCredentials({ profile: 'frontend' }),
    //     ...CredentialProviderChain.defaultProviders,
    // ]),
})

export const bucket = process.env.bucket || 'editions-store-code'
