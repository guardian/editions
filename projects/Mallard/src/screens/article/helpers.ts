import { NativeSyntheticEvent, NativeScrollEvent } from 'react-native'

export type OnTopPositionChangeFn = (isAtTop: boolean) => void

export const wireScrollBarToDismiss = (
    onTopPositionChange: OnTopPositionChangeFn,
) => ({
    scrollEventThrottle: 8,
    onScroll: (ev: NativeSyntheticEvent<NativeScrollEvent>) => {
        onTopPositionChange(ev.nativeEvent.contentOffset.y <= 0)
    },
})
