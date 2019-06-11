import { IAsset } from '@guardian/capi-ts'

export const extractImage: (assetArray: IAsset[]) => IAsset = assetArray => {
    return assetArray.reduce((biggest, current) => {
        const biggestWidth = (biggest.typeData && biggest.typeData.width) || 0
        const currentWidth = (current.typeData && current.typeData.width) || -1
        if (currentWidth > biggestWidth) return current
        return biggest
    })
}

export const signImageUrl: (url: string) => string = _ => _
