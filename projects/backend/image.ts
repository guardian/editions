import { createHash } from 'crypto'
import { ImageSize } from './common'
const salt = process.env.IMAGE_SALT

export const getImageSlug = (url: string) => {
    const parsed = new URL(url)
    const path = parsed.pathname
    const host = parsed.hostname
    const hostparts = host.split('.')
    const source = hostparts[0]
    return source + path
}

const getSignature = (path: string) => {
    console.log(`${salt}${path}`)
    return createHash('md5')
        .update(`${salt}/${path}`)
        .digest('hex')
}

const getSize = (size: ImageSize) => {
    switch (size) {
        case 'small':
            return 500
        case 'notsmall':
            return 2000
    }
}

export const getRedirect = (source: string, size: ImageSize, path: string) => {
    const newPath = `${path}?q=85&w=${getSize(size)}` //&dpr=2&width=500&auto=format`
    return `https://i.guim.co.uk/img/${source}/${newPath}&s=${getSignature(
        newPath,
    )}`
}
