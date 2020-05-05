import { createHash } from 'crypto'
import { ImageUse, imageUseSizes } from '../Apps/common/src'
import { Image, ImageSize, ImageRole, imageRoles } from './common'
import { IAssetFields } from '@guardian/capi-ts'

const salt = process.env.IMAGE_SALT

export const getImageFromURL = (
    url?: string,
    typeData?: IAssetFields,
): Image | undefined => {
    if (url === undefined) return undefined
    try {
        const parsed = new URL(url)
        const path = parsed.pathname.slice(1) //remove leading slash
        const host = parsed.hostname
        const hostparts = host.split('.')
        const source = hostparts[0]
        const role = typeData && typeData.role
        const imageRole = imageRoles.find(r => r === role)
        return { source, path, role: imageRole }
    } catch (e) {
        console.error(`Encountered error parsing ${url}`)
        console.error(JSON.stringify(e))
        return
    }
}

const getSignature = (path: string) => {
    return createHash('md5')
        .update(`${salt}/${path}`)
        .digest('hex')
}

export const getImageURL = (
    image: Image,
    size: ImageSize,
    imageUse: ImageUse,
    imageRole: ImageRole,
) => {
    const width = imageUseSizes[imageUse][size]
    const widthForRole =
        imageRole === 'showcase' || imageRole === 'immersive'
            ? width * 2
            : width
    const newPath = `${image.path}?quality=50&dpr=2&width=${widthForRole}`
    return `https://i.guim.co.uk/img/${
        image.source
    }/${newPath}&s=${getSignature(newPath)}`
}
