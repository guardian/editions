import React, { useState } from 'react'
import {
    Animated,
    StyleSheet,
    PanResponder,
    TouchableWithoutFeedback,
} from 'react-native'
import { Chevron } from '../../chevron'
import { metrics } from '../../../theme/spacing'
import { dismissAt } from './helpers'

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
    const [panResponder] = useState(() =>
        PanResponder.create({
            /* we don't do anything until we 
            detect a downwards motion. This is done 
            because panresponder cancels the event from 
            bubbling if it's using it and we want back button 
            inside this can pick up the touch event  */
            onStartShouldSetPanResponder: () => false,
            onMoveShouldSetPanResponder: (e, { dy }) => dy > 1,
            onPanResponderMove: Animated.event([null, { dy: cardOffset }]),
            onPanResponderRelease: (e, { dy }) => {
                if (dy >= dismissAt) {
                    onDismiss()
                } else {
                    Animated.spring(cardOffset, {
                        toValue: 0,
                        bounciness: 10,
                        useNativeDriver: true,
                    }).start()
                }
            },
        }),
    )
    return (
        <Animated.View
            style={[styles.headerContainer]}
            {...panResponder.panHandlers}
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
                                        inputRange: [0, 200],
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
                            inputRange: [0, 200],
                            outputRange: [0, 1],
                            extrapolate: 'clamp',
                        }),
                    },
                ]}
            />
        </Animated.View>
    )
}

export { Header }
