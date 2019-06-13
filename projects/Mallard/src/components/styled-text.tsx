import React from 'react'
import { Text, View, StyleSheet, TextStyle, StyleProp } from 'react-native'
import { useAppAppearance } from '../theme/appearance'
import { metrics } from '../theme/spacing'
import { color } from '../theme/color'

const cardStyles = {
    default: {
        fontSize: 19,
        lineHeight: 22,
    },
}

const styles = StyleSheet.create({
    headlineText: {
        fontFamily: 'GHGuardianHeadline-Regular',
        fontSize: 30,
        lineHeight: 34,
        color: color.text,
    },
    headlineKickerText: {
        fontFamily: 'GTGuardianTitlepiece-Bold',
        ...cardStyles.default,
    },
    headlineCardText: {
        ...cardStyles.default,
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
    style?: StyleProp<TextStyle>
}) => {
    return <Text {...props} style={[styles.headlineText, style]} />
}

export const HeadlineKickerText = ({
    style,
    ...props
}: {
    children: string
    style?: StyleProp<TextStyle>
}) => {
    return <Text {...props} style={[styles.headlineKickerText, style]} />
}

export const StandfirstText = ({
    style,
    ...props
}: {
    children: string
    style?: StyleProp<TextStyle>
}) => {
    return <Text {...props} style={[styles.standfirstText, style]} />
}

export const HeadlineCardText = ({
    children,
    style,
    ...props
}: {
    children: string
    style?: StyleProp<TextStyle>
}) => (
    <HeadlineText {...props} style={[styles.headlineCardText, style]}>
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
                styles.bodyCopy,
                {
                    color: useAppAppearance().color,
                },
                weight === 'bold' && {
                    fontFamily: 'GuardianTextSans-Bold',
                },
                style,
            ]}
        >
            {children}
        </Text>
    )
}
UiBodyCopy.defaultProps = {
    weight: 'regular',
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
