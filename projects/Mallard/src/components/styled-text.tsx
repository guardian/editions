import React from 'react'
import { Text, View, StyleSheet } from 'react-native'
import { useAppAppearance } from '../theme/appearance'
import { metrics } from '../theme/spacing'
import { color } from '../theme/color'

const styles = StyleSheet.create({
    headlineText: {
        fontFamily: 'GHGuardianHeadline-Medium',
        fontSize: 24,
        color: color.text,
    },
    headlineCardText: {
        fontSize: 16,
    },
    bodyCopy: {
        fontSize: 17,
        fontFamily: 'GuardianTextSans-Regular',
    },
    explainerCopy: { fontSize: 15, fontFamily: 'GuardianTextSans-Regular' },
})
export const HeadlineText = ({
    style,
    ...props
}: {
    children: string
    style?: {}
}) => {
    return <Text {...props} style={[styles.headlineText, style]} />
}

export const HeadlineCardText = ({
    children,
    ...props
}: {
    children: string
}) => (
    <HeadlineText {...props} style={styles.headlineCardText}>
        {children}
    </HeadlineText>
)

export const UiBodyCopy = ({
    children,
    style,
    ...props
}: {
    children: string
    style?: {}
}) => {
    return (
        <Text
            {...props}
            style={[
                styles.bodyCopy,
                {
                    color: useAppAppearance().color,
                },
                style,
            ]}
        >
            {children}
        </Text>
    )
}

export const UiExplainerCopy = ({
    children,
    style,
    ...props
}: {
    children: string
    style?: any
}) => {
    return (
        <Text
            {...props}
            style={[
                styles.explainerCopy,
                {
                    color: useAppAppearance().dimColor,
                },
                style,
            ]}
        >
            {children}
        </Text>
    )
}

export const MonoTextBlock = ({
    children,
    style,
    ...props
}: {
    children: any
    style?: any
}) => {
    return (
        <View
            {...props}
            style={{
                padding: metrics.vertical,
                paddingHorizontal: metrics.horizontal,
                alignItems: 'center',
                ...style,
            }}
        >
            <UiExplainerCopy style={{ textAlign: 'center' }}>
                {children}
            </UiExplainerCopy>
        </View>
    )
}
