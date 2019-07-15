import { useState, useEffect } from 'react'
import { currentInsets } from '@delightfulstudio/react-native-safe-area-insets'
import { getStatusBarHeight } from 'react-native-status-bar-height'
import { Dimensions } from 'react-native'

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

export { useInsets }
