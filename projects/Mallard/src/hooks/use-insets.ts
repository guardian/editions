import { useState, useEffect } from 'react'
import { currentInsets } from '@delightfulstudio/react-native-safe-area-insets'

const useInsets = () => {
    const [insets, setInsets] = useState({
        left: 0,
        top: 0,
        bottom: 0,
        right: 0,
    })
    useEffect(() => {
        currentInsets().then(setInsets)
    }, [])
    return insets
}

export { useInsets }
