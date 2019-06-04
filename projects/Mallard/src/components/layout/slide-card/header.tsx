import React from 'react'
import {
    Animated,
    StyleSheet,
    View,
    TouchableWithoutFeedback,
    StyleProp,
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
    },
    headerChevronContainer: {
        flex: 1,
        width: '100%',
        paddingHorizontal: metrics.horizontal,
        justifyContent: 'center',
        alignItems: 'center',
        zIndex: 20,
    },
    headerBackground: {
        zIndex: 10,
        borderTopWidth: StyleSheet.hairlineWidth,
        borderBottomWidth: StyleSheet.hairlineWidth,
    },
})

const Header = ({
    scrollY,
    fadesHeaderIn,
    style,
    onDismiss,
}: {
    scrollY: Animated.Value
    fadesHeaderIn: boolean
    style: StyleProp<{}>
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
                    <Chevron
                        color={
                            fadesHeaderIn ? color.textOverDarkBackground : color.text
                        }
                    />
                </Animated.View>
            </TouchableWithoutFeedback>
            <Animated.View
                style={[
                    style,
                    StyleSheet.absoluteFillObject,
                    styles.headerBackground,
                    fadesHeaderIn
                        ? {
                              opacity: scrollY.interpolate({
                                  inputRange: [0, 50],
                                  outputRange: [0, 1],
                                  extrapolate: 'clamp',
                              }),
                          }
                        : {
                              opacity: 1,
                          },
                ]}
            />
        </View>
    )
}

export { Header }
