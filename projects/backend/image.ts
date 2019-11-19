import { createHash } from 'crypto'
import { ImageUse, imageUseSizes } from '../Apps/common/src'
import { Image, ImageSize } from './common'

const salt = process.env.IMAGE_SALT

export const getImageFromURL = (url?: string): Image | undefined => {
    if (url === undefined) return undefined
    try {
        const parsed = new URL(url)
        const path = parsed.pathname.slice(1) //remove leading slash
        const host = parsed.hostname
        const hostparts = host.split('.')
        const source = hostparts[0]
        return { source, path }
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
) => {
    const newPath = `${image.path}?q=50&dpr=2&w=${imageUseSizes[imageUse][size]}`
    return `https://i.guim.co.uk/img/${
        image.source
    }/${newPath}&s=${getSignature(newPath)}`
}
