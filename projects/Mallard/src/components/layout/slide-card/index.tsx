import React, { ReactNode } from 'react'
import { Animated, StyleSheet, View } from 'react-native'
import { Header } from './header'

/*
This is the swipey contraption that contains an article.
*/

const styles = StyleSheet.create({
    container: {
        flex: 0,
        flexShrink: 0,
        height: '100%',
        overflow: 'hidden',
    },
    flexGrow: {
        flexGrow: 1,
    },
})

export const SlideCard = ({
    children,
    onDismiss,
}: {
    children: ReactNode
    onDismiss: () => void
}) => (
    <Animated.View style={[styles.container]}>
        <View style={[{ flex: 1 }]}>
            <Header
                {...{
                    onDismiss,
                }}
            />
            {children}
        </View>
    </Animated.View>
)

SlideCard.defaultProps = {
    fadesHeaderIn: false,
}
