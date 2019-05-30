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
    },
    headlineCardText: {
        fontSize: 16,
        lineHeight: 20,
    },
    standfirstText: {
        fontFamily: 'GuardianTextEgyptian-Reg',
        fontSize: 17,
        lineHeight: 21,
    },
    serifBodyCopy: {
        fontFamily: 'GuardianTextEgyptian-Reg',
        fontSize: 17,
        lineHeight: 21,
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

export const StandfirstText = ({
    style,
    ...props
}: {
    children: string
    style?: {}
}) => {
    return <Text {...props} style={[styles.standfirstText, style]} />
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

export const BodyCopy = ({
    style,
    weight,
    ...props
}: {
    children: string
    weight: 'regular' | 'bold'
    style?: {}
}) => {
    return (
        <Text
            {...props}
            style={[
                styles.serifBodyCopy,
                style,
                weight === 'bold' && {
                    fontFamily: 'GuardianTextEgyptian-Bold',
                },
            ]}
        />
    )
}
BodyCopy.defaultProps = {
    weight: 'regular',
}

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
