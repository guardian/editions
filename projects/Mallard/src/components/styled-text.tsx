import React from 'react'
import { Text, View, StyleSheet } from 'react-native'
import { useAppAppearance } from '../theme/appearance'
import { metrics } from '../theme/spacing'
import { color } from '../theme/color'

const styles = StyleSheet.create({
    headlineText: {
        fontFamily: 'GHGuardianHeadline-Medium',
        fontSize: 30,
        lineHeight: 34,
        color: color.text,
    },
    headlineKickerText: {
        fontFamily: 'GTGuardianTitlepiece-Bold',
        fontSize: 15,
        lineHeight: 24,
        letterSpacing: 2,
        textTransform: 'uppercase',
    },
    headlineCardText: {
        fontSize: 16,
        lineHeight: 20,
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

export const HeadlineKickerText = ({
    style,
    ...props
}: {
    children: string
    style?: {}
}) => {
    return <Text {...props} style={[styles.headlineKickerText, style]} />
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
