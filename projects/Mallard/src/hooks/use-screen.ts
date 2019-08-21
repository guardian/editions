import { useState, useEffect } from 'react'
import { currentInsets } from '@delightfulstudio/react-native-safe-area-insets'
import { getStatusBarHeight } from 'react-native-status-bar-height'
import { Dimensions, ScaledSize } from 'react-native'

const useDimensions = (): ScaledSize => {
    const [dimensions, setDimensions] = useState(Dimensions.get('window'))
    useEffect(() => {
        const listener = (
            ev: Parameters<
                Parameters<typeof Dimensions.addEventListener>[1]
            >[0],
        ) => {
            setDimensions(ev.window)
        }
        Dimensions.addEventListener('change', listener)
        return () => {
            Dimensions.removeEventListener('change', listener)
        }
    }, [])

    return dimensions
}

const useMediaQuery = (condition: (width: number) => boolean): boolean => {
    const { width } = useDimensions()
    return condition(width)
}

const useInsets = () => {
    const [insets, setInsets] = useState({
        left: 0,
        top: getStatusBarHeight(true),
        bottom: 0,
        right: 0,
    })
    useEffect(() => {
        const updateInsets = () => {
            currentInsets().then(insets => {
                setInsets({
                    ...insets,
                    top: insets.top ? insets.top : getStatusBarHeight(true),
                })
            })
        }
        updateInsets()
        Dimensions.addEventListener('change', () => {
            requestAnimationFrame(() => {
                updateInsets()
            })
        })
    }, [])
    return insets
}

export { useInsets, useDimensions, useMediaQuery }
