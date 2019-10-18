import { useState, useEffect } from 'react'
import { currentInsets } from '@delightfulstudio/react-native-safe-area-insets'
import { getStatusBarHeight } from 'react-native-status-bar-height'
import { Dimensions, ScaledSize } from 'react-native'
import { Breakpoints } from 'src/theme/breakpoints'

const useDimensions = (): ScaledSize => {
    const [dimensions, setDimensions] = useState(Dimensions.get('window'))
    useEffect(() => {
        const listener = (
            ev: Parameters<
                Parameters<typeof Dimensions.addEventListener>[1]
            >[0],
        ) => {
            /*
            this fixes this issue:
            https://trello.com/c/iEtMz9TH/867-video-stretched-on-ios-and-android-crash-on-orientation-change

            this means we will never relayout on smaller screens. For now this is ok
            because our screen size assumptions are a 1:1 match with iphone/ipad and
            a good enough™ match on android

            a more elegant fix would be to detect when a full screen video/photo
            is playing, basically anything that enables rotation when
            things below it should not rotate, and not relayout then.
            */
            if (
                Math.min(ev.window.width, ev.window.height) >=
                Breakpoints.tabletVertical
            ) {
                setDimensions(ev.window)
            }
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
