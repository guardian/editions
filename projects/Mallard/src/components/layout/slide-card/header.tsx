import React from 'react'
import { Animated, StyleSheet, TouchableWithoutFeedback } from 'react-native'
import { Chevron } from '../../chevron'
import { metrics } from 'src/theme/spacing'
import { color } from 'src/theme/color'
import { safeInterpolation } from 'src/helpers/math'
import { useDismissResponder } from 'src/hooks/use-dismiss-responder'
import { ArticleNavigatorInjectedProps } from 'src/navigation/navigators/article'

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

const Header = ({ onDismiss }: ArticleNavigatorInjectedProps) => {
    const { panResponder, scrollY } = useDismissResponder(onDismiss)
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
