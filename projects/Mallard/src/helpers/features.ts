import { Platform } from 'react-native'

export const supportsTransparentCards = () => Platform.OS === 'ios'

export const supportsAnimatedClipView = () => Platform.OS === 'ios'
