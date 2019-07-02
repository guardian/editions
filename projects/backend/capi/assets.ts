import { IAsset } from '@guardian/capi-ts'

export const extractImage: (assetArray: IAsset[]) => IAsset = assetArray => {
    // This returns the master image, or, failing that, the largest.
    // As long as our CAPI key is internal, we should always have a master.
    const master = assetArray.find(_ => _.file && _.file.includes('/master/'))
    if (master) return master
    console.warn(
        'Failed to find a master image in CAPI response',
        assetArray[0].file,
    )
    return assetArray.reduce((biggest, current) => {
        const biggestWidth = (biggest.typeData && biggest.typeData.width) || 0
        const currentWidth = (current.typeData && current.typeData.width) || -1
        if (currentWidth > biggestWidth) return current
        return biggest
    })
}

export const signImageUrl: (url: string) => string = _ => _
