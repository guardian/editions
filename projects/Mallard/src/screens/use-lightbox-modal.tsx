import React, { useState, createContext, useCallback } from 'react'
import { ImageElement, ArticlePillar } from '../../../Apps/common/src'

export interface LightboxContextType {
    visible: boolean
    setLightboxVisible: (newVisible: boolean) => void
    images: ImageElement[]
    setLightboxData: (
        images: ImageElement[],
        index: number,
        pillar: ArticlePillar,
    ) => void
    pillar: ArticlePillar
    index: number
}

export const LIGHTBOX_VISIBLE_DEFAULT: LightboxContextType = {
    visible: false,
    setLightboxVisible: () => {},
    images: [],
    setLightboxData: () => {},
    pillar: 'news',
    index: 0,
}

export const LightboxContext = createContext<LightboxContextType>(
    LIGHTBOX_VISIBLE_DEFAULT,
)

type Props = { children: React.ReactNode }

export const useLightboxProvider = (): LightboxContextType => {
    const [visible, setVisible] = useState<boolean>(false)
    const setLightboxVisible = useCallback((newVisible: boolean): void => {
        setVisible(newVisible)
    }, [])

    const [images, setImages] = useState<ImageElement[]>([])
    const [pillar, setPillar] = useState<ArticlePillar>('news')
    const [index, setIndex] = useState<number>(0)
    const setLightboxData = useCallback(
        (
            newImages: ImageElement[],
            newIndex: number,
            newPillar: ArticlePillar,
        ): void => {
            setImages(newImages)
            setIndex(newIndex)
            setPillar(newPillar)
        },
        [],
    )

    return {
        visible,
        setLightboxVisible,
        images,
        setLightboxData,
        pillar,
        index,
    }
}

export const LightboxProvider = ({ children }: Props) => {
    const lightboxVisible = useLightboxProvider()
    return (
        <LightboxContext.Provider value={lightboxVisible}>
            {children}
        </LightboxContext.Provider>
    )
}
