import React, { useMemo } from 'react'
import {
    Animated,
    StyleSheet,
    View,
    TouchableWithoutFeedback,
    PanResponder,
} from 'react-native'
import { Chevron } from '../../chevron'
import { metrics } from 'src/theme/spacing'
import { color } from 'src/theme/color'
import { safeInterpolation } from 'src/helpers/math'

const styles = StyleSheet.create({
    headerContainer: {
        height: metrics.headerHeight,
        zIndex: 90,
        alignContent: 'stretch',
        justifyContent: 'center',
        backgroundColor: color.background,
        borderColor: color.line,
        borderTopWidth: StyleSheet.hairlineWidth,
        borderBottomWidth: StyleSheet.hairlineWidth,
    },
    headerChevronContainer: {
        flex: 1,
        width: '100%',
        paddingHorizontal: metrics.horizontal,
        justifyContent: 'center',
        alignItems: 'center',
        zIndex: 20,
    },
})

const Header = ({
    scrollY,
    onDismiss,
}: {
    scrollY: Animated.Value
    onDismiss: () => void
}) => {
    const panResponder = useMemo(
        () =>
            PanResponder.create({
                onMoveShouldSetPanResponder: (ev, gestureState) =>
                    gestureState.dy !== 0, // ignore taps
                onStartShouldSetPanResponder: () => true,
                onPanResponderMove: Animated.event([
                    null,
                    {
                        dy: scrollY,
                    },
                ]),
                onPanResponderEnd: (ev, gestureState) => {
                    if (gestureState.dy > 50) {
                        onDismiss()
                        scrollY.stopAnimation()
                        return
                    }
                    Animated.timing(scrollY, {
                        useNativeDriver: true,
                        toValue: 0,
                        duration: 200,
                    }).start()
                },
            }),
        [onDismiss, scrollY],
    )
    return (
        <Animated.View
            {...panResponder.panHandlers}
            style={[styles.headerContainer]}
        >
            <TouchableWithoutFeedback
                onPress={onDismiss}
                accessibilityHint="Go back"
            >
                <Animated.View
                    style={[
                        styles.headerChevronContainer,
                        {
                            transform: [
                                {
                                    translateY: scrollY.interpolate({
                                        inputRange: safeInterpolation([0, 100]),
                                        outputRange: safeInterpolation([
                                            metrics.headerHeight / -10,
                                            0,
                                        ]),
                                        extrapolate: 'clamp',
                                    }),
                                },
                            ],
                        },
                    ]}
                >
                    <Chevron color={color.text} />
                </Animated.View>
            </TouchableWithoutFeedback>
        </Animated.View>
    )
}

export { Header }
