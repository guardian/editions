import React from 'react'
import {
    Animated,
    StyleSheet,
    View,
    TouchableWithoutFeedback,
} from 'react-native'
import { Chevron } from '../../chevron'
import { metrics } from '../../../theme/spacing'
import { color } from '../../../theme/color'

const styles = StyleSheet.create({
    headerContainer: {
        position: 'absolute',
        top: 0,
        right: 0,
        left: 0,
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
    return (
        <View style={[styles.headerContainer]}>
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
                                        inputRange: [0, 100],
                                        outputRange: [
                                            metrics.headerHeight / -10,
                                            0,
                                        ],
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
        </View>
    )
}

export { Header }
