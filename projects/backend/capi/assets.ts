import { IAsset, IBlockElement } from '@guardian/capi-ts'
import { Image } from '../common'
import { getImageFromURL } from '../image'
import { CreditedImage } from '../../Apps/common/src'
import { oc } from 'ts-optchain'

const extractImage: (
    assetArray: IAsset[],
) => IAsset | undefined = assetArray => {
    if (assetArray.length === 0) {
        console.warn('No assets found in asset array: ' + assetArray)
        return undefined
    }

    // This returns the master image, or, failing that, the largest.
    // As long as our CAPI key is internal, we should always have a master.
    const master = assetArray.find(_ => _.typeData && _.typeData.isMaster)
    if (master) return master
    console.warn(
        'Failed to find a master image in CAPI response',
        JSON.stringify(assetArray),
    )
    return assetArray.reduce((biggest, current) => {
        const biggestWidth = (biggest.typeData && biggest.typeData.width) || 0
        const currentWidth = (current.typeData && current.typeData.width) || -1
        if (currentWidth > biggestWidth) return current
        return biggest
    })
}

export const getImage: (
    assetArray: IAsset[],
) => Image | undefined = assetArray => {
    console.log('Asset array == ' + assetArray)
    console.log('Asset array type == ' + typeof assetArray)
    const asset = extractImage(assetArray)
    if (!(asset && asset.file)) {
        console.warn('Image asset potentially invalid.', JSON.stringify(asset))
        return
    }
    return getImageFromURL(asset.file)
}

export const getCreditedImage: (
    element: IBlockElement,
) => CreditedImage | undefined = element => {
    const asset = extractImage(element.assets)
    if (!(asset && asset.file)) {
        console.warn('Image asset potentially invalid.', JSON.stringify(asset))
        return
    }
    const image = getImageFromURL(asset.file)
    return (
        image && {
            ...image,
            credit: oc(element).imageTypeData.credit(),
            caption: oc(element).imageTypeData.caption(),
            displayCredit: oc(element).imageTypeData.displayCredit(),
        }
    )
}
