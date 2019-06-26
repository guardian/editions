import React, { useState, useEffect, ReactNode } from 'react'
import { Animated, StyleSheet, StyleProp, ViewStyle } from 'react-native'
import { Header } from './header'
import { dismissAt } from './helpers'
import { metrics } from 'src/theme/spacing'

/* 
This is the swipey contraption that contains an article.
*/

const styles = StyleSheet.create({
    container: {
        flex: 0,
        flexShrink: 0,
        height: '100%',
    },
    flexGrow: {
        flexGrow: 1,
    },
})

export const SlideCard = ({
    children,
    viewIsTransitioning,
    onDismiss,
}: {
    children: ReactNode
    viewIsTransitioning?: boolean
    onDismiss: () => void
}) => {
    const [scrollY] = useState(() => new Animated.Value(1))
    useEffect(() => {
        scrollY.addListener(({ value }) => {
            if (value < dismissAt * -1) {
                onDismiss()
            }
        })
    }, []) // eslint-disable-line react-hooks/exhaustive-deps

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
            {viewIsTransitioning ? null : (
                <Header
                    {...{
                        scrollY,
                        onDismiss,
                    }}
                />
            )}
            <Animated.ScrollView
                scrollEventThrottle={1}
                contentContainerStyle={styles.flexGrow}
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
                    { useNativeDriver: false },
                )}
            >
                <Animated.View
                    style={[
                        styles.flexGrow,
                        {
                            transform: [
                                {
                                    translateY: scrollY.interpolate({
                                        inputRange: [-110, 0],
                                        outputRange: [-100, 0],
                                        extrapolate: 'clamp',
                                    }),
                                },
                            ],
                        },
                    ]}
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
