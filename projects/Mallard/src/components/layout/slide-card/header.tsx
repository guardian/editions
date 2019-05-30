import React, { useState } from 'react'
import {
    Animated,
    StyleSheet,
    View,
    TouchableWithoutFeedback,
} from 'react-native'
import { Chevron } from '../../chevron'
import { metrics } from '../../../theme/spacing'

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

const Header = ({ scrollY, cardOffset, style, onDismiss }: any) => {
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
                                            metrics.headerHeight / -4,
                                            0,
                                        ],
                                        extrapolate: 'clamp',
                                    }),
                                },
                            ],
                        },
                    ]}
                >
                    <Chevron color={StyleSheet.flatten(style).color} />
                </Animated.View>
            </TouchableWithoutFeedback>
            <Animated.View
                style={[
                    style,
                    StyleSheet.absoluteFillObject,
                    styles.headerBackground,
                    {
                        opacity: scrollY.interpolate({
                            inputRange: [0, 50],
                            outputRange: [0, 1],
                            extrapolate: 'clamp',
                        }),
                    },
                ]}
            />
        </View>
    )
}

export { Header }
