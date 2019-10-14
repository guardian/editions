import { useState, useEffect } from 'react'
import { ImageSize } from '../../../common/src'
import { imageForScreenSize } from 'src/helpers/screen'

const useImageSize = () => {
    const [imageSize, setImageSize] = useState<ImageSize>('phone')

    useEffect(() => {
        imageForScreenSize().then(imgSize => {
            setImageSize(imgSize)
        })
    })

    return {
        imageSize,
    }
}

export { useImageSize }
