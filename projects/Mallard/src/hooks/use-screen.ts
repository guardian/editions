import { useState, useEffect } from 'react'
import { currentInsets } from '@delightfulstudio/react-native-safe-area-insets'
import { getStatusBarHeight } from 'react-native-status-bar-height'
import { Dimensions, ScaledSize } from 'react-native'
import { areEqualShallow } from 'src/helpers/features'

const useDimensions = (): ScaledSize => {
    const [dimensions, setDimensions] = useState(Dimensions.get('window'))
    useEffect(() => {
        const listener = (
            ev: Parameters<
                Parameters<typeof Dimensions.addEventListener>[1]
            >[0],
        ) => {
            console.log(ev.window, dimensions)
            if (!areEqualShallow(ev.window, dimensions)) {
                setDimensions(ev.window)
            } else {
                console.log('skip')
            }
        }
        Dimensions.addEventListener('change', listener)
        return () => {
            Dimensions.removeEventListener('change', listener)
        }
    }, [])

    return dimensions
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

export { useInsets, useDimensions }
