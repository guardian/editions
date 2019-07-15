import { useState, useEffect } from 'react'
import { currentInsets } from '@delightfulstudio/react-native-safe-area-insets'
import { getStatusBarHeight } from 'react-native-status-bar-height'

const useInsets = () => {
    const [insets, setInsets] = useState({
        left: 0,
        top: getStatusBarHeight(),
        bottom: 0,
        right: 0,
    })
    useEffect(() => {
        currentInsets().then(insets => {
            setInsets({
                ...insets,
                top: insets.top ? insets.top : getStatusBarHeight(),
            })
        })
    }, [])
    return insets
}

export { useInsets }
