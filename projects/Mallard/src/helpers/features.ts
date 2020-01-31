import { Platform } from 'react-native'

// TEMP FUNCTION FOR TESTING WILL USE DEVICE MEMORY
export const supportsAnimation = () =>
    (Platform.OS === 'ios' && parseInt(String(Platform.Version), 10) >= 12) ||
    Platform.OS === 'android'

export const supportsTransparentCards = () => Platform.OS === 'ios'

export const supportsAnimatedClipView = () => Platform.OS === 'ios'

export const areEqualShallow = <A>(
    a: A,
    b: { [key in keyof A]: unknown },
): boolean => {
    for (const key in a) {
        if (a[key] !== b[key]) {
            return false
        }
    }
    return true
}
