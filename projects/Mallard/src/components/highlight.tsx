import React from 'react'
import { Platform } from 'react-native'
import {
    TouchableNativeFeedback,
    TouchableOpacity,
} from 'react-native-gesture-handler'

const Highlight: React.FC<{
    onPress: () => void
    children: React.ReactNode
}> = ({ onPress, children }) => {
    return Platform.OS === 'android' ? (
        <TouchableNativeFeedback onPress={onPress}>
            {children}
        </TouchableNativeFeedback>
    ) : (
        <TouchableOpacity onPress={onPress}>{children}</TouchableOpacity>
    )
}

export { Highlight }
