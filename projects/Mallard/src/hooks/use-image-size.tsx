import React, { useState, useEffect, createContext, useContext } from 'react'
import { ImageSize } from '../../../Apps/common/src'
import { imageForScreenSize } from 'src/helpers/screen'

const Context = createContext<ImageSize>('phone')

type Props = { children: React.ReactNode }
export const ImageSizeProvider = ({ children }: Props) => {
    const [imageSize, setImageSize] = useState<ImageSize | null>(null)
    useEffect(() => {
        imageForScreenSize().then(imgSize => {
            setImageSize(imgSize)
        })
    })

    if (imageSize == null) return null
    return <Context.Provider value={imageSize}>{children}</Context.Provider>
}

export const useImageSize = () => {
    return useContext(Context)
}
