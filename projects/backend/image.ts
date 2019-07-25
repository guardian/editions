import { createHash } from 'crypto'
import { ImageSize, Image } from './common'
import Vibrant from 'node-vibrant'

const salt = process.env.IMAGE_SALT

export const getImageFromURL = (url: string): Image => {
    const parsed = new URL(url)
    const path = parsed.pathname.slice(1) //remove leading slash
    const host = parsed.hostname
    const hostparts = host.split('.')
    const source = hostparts[0]
    return { source, path }
}

const getSignature = (path: string) => {
    return createHash('md5')
        .update(`${salt}/${path}`)
        .digest('hex')
}

const sizes: { [k in ImageSize]: number } = {
    phone: 1500,
    tablet: 5555,
    sample: 200,
}

export const getImageURL = (image: Image, size: ImageSize) => {
    const newPath = `${image.path}?q=85&dpr=2&w=${sizes[size]}`
    return `https://i.guim.co.uk/img/${
        image.source
        }/${newPath}&s=${getSignature(newPath)}`
}

export const getPalette = async (image: Image) => {
    const url = getImageURL(image, 'sample')
    console.log(url)
    const v = Vibrant.from(url).build()
    const palette = await v.getPalette()
    return {
        ...image,
        palette: {
            Vibrant: palette.Vibrant && palette.Vibrant.getHex(),
            Muted: palette.Muted && palette.Muted.getHex(),
            DarkVibrant: palette.DarkVibrant && palette.DarkVibrant.getHex(),
            DarkMuted: palette.DarkMuted && palette.DarkMuted.getHex(),
            LightVibrant: palette.LightVibrant && palette.LightVibrant.getHex(),
            LightMuted: palette.LightMuted && palette.LightMuted.getHex(),
        },
    }
}
