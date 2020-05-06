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

type AspectRatioType = 'landscape-wide' | 'portrait' | 'landscape'

// example path /d9dfd06b5042a9808b4bc3be3ccea4122cda6cb1/0_0_<width>_<height>/master/7087.jpg
const detectImageAspectRatio = (path: string): AspectRatioType => {
    const widthHeightSegment = path.split('/')[1]
    const widthHeightSegmentSplit =
        widthHeightSegment && widthHeightSegment.split('_')
    if (
        widthHeightSegment &&
        widthHeightSegmentSplit &&
        widthHeightSegmentSplit.length === 4
    ) {
        const width = parseInt(widthHeightSegmentSplit[2])
        const height = parseInt(widthHeightSegmentSplit[3])

        const aspectRatio = width / height

        if (aspectRatio > 2) {
            return 'landscape-wide'
        } else if (aspectRatio < 1) {
            return 'portrait'
        }
    }

    return 'landscape'
}

export const adjustWidth = (
    width: number,
    aspectRatio: AspectRatioType,
    role?: ImageRole,
): number => {
    if (
        role === 'showcase' ||
        role === 'immersive' ||
        aspectRatio === 'landscape-wide'
    ) {
        return width * 2
    } else return width
}

export const getImageURL = (
    image: Image,
    size: ImageSize,
    imageUse: ImageUse,
) => {
    const width = imageUseSizes[imageUse][size]
    const aspectRatio = detectImageAspectRatio(image.path)
    const adjustedWidth = adjustWidth(width, aspectRatio, image.role)

    const newPath = `${image.path}?quality=50&dpr=2&width=${adjustedWidth}`
    return `https://i.guim.co.uk/img/${
        image.source
    }/${newPath}&s=${getSignature(newPath)}`
}
