import React, { useState, useEffect, ReactNode } from 'react'
import { Animated, StyleSheet } from 'react-native'
import { Header } from './header'
import { dismissAt } from './helpers'
import { metrics } from '../../../theme/spacing'

/* 
This is the swipey contraption that contains an article.
*/

const styles = StyleSheet.create({
    container: {
        marginTop: metrics.slideCardSpacing,
        shadowColor: '#000',
        shadowOffset: {
            width: 0,
            height: -2,
        },
        shadowOpacity: 0.25,
        shadowRadius: 3.84,
        elevation: 5,
        flex: 1,
    },
})

export const SlideCard = ({
    children,
    onDismiss,
}: {
    children: ReactNode
    onDismiss: () => void
}) => {
    const [scrollY] = useState(() => new Animated.Value(1))
    useEffect(() => {
        scrollY.addListener(({ value }) => {
            if (value < dismissAt * -1) {
                onDismiss()
            }
        })
    }, [])
    return (
        <Animated.View
            style={[
                styles.container,
                {
                    transform: [
                        {
                            translateY: scrollY.interpolate({
                                inputRange: [dismissAt * -1, 0],
                                outputRange: [dismissAt, 0],
                                extrapolate: 'clamp',
                            }),
                        },
                    ],
                },
            ]}
        >
            <Header
                {...{
                    scrollY,
                    onDismiss,
                }}
            />
            <Animated.ScrollView
                scrollEventThrottle={1}
                contentContainerStyle={{
                    flexGrow: 1,
                }}
                onScroll={Animated.event(
                    [
                        {
                            nativeEvent: {
                                contentOffset: {
                                    y: scrollY,
                                },
                            },
                        },
                    ],
                    { useNativeDriver: true },
                )}
            >
                <Animated.View
                    style={{
                        transform: [
                            {
                                translateY: scrollY.interpolate({
                                    inputRange: [-110, 0],
                                    outputRange: [-100, 0],
                                    extrapolate: 'clamp',
                                }),
                            },
                        ],
                    }}
                >
                    {children}
                </Animated.View>
            </Animated.ScrollView>
        </Animated.View>
    )
}

SlideCard.defaultProps = {
    fadesHeaderIn: false,
}
