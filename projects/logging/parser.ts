import { _Blob } from 'aws-sdk/clients/lambda'

export const awsToString = (
    actuallyString: _Blob | undefined,
): string | undefined => {
    if (typeof actuallyString === 'string') return actuallyString as string
    if (Buffer.isBuffer(actuallyString))
        return (actuallyString as Buffer).toString()
    if (actuallyString && actuallyString.constructor === Uint8Array)
        return (actuallyString as Uint8Array).toString()
    return undefined //I could not find how to unpack a blob
}
