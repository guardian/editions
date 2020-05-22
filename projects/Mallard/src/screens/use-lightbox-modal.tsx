import React, { useState, createContext, useCallback } from 'react'
import { ArticlePillar, CreditedImage } from '../../../Apps/common/src'

export interface LightboxContextType {
    images: CreditedImage[]
    setLightboxData: (
        images: CreditedImage[],
        index: number,
        pillar: ArticlePillar,
    ) => void
    pillar: ArticlePillar
    index: number
}

export const LIGHTBOX_VISIBLE_DEFAULT: LightboxContextType = {
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
    const [images, setImages] = useState<CreditedImage[]>([])
    const [pillar, setPillar] = useState<ArticlePillar>('news')
    const [index, setIndex] = useState<number>(0)
    const setLightboxData = useCallback(
        (
            newImages: CreditedImage[],
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
        images,
        setLightboxData,
        pillar,
        index,
    }
}

export const LightboxProvider = ({ children }: Props) => {
    const lightboxData = useLightboxProvider()
    return (
        <LightboxContext.Provider value={lightboxData}>
            {children}
        </LightboxContext.Provider>
    )
}
