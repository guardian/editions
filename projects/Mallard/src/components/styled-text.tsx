import React from 'react'
import { Text, View } from 'react-native'
import { color, useAppearanceColor } from '../theme/color'
import { metrics } from '../theme/spacing'

export const HeadlineText = ({
    style,
    ...props
}: {
    children: string
    style?: {}
}) => {
    return (
        <Text
            {...props}
            style={{
                fontFamily: 'GHGuardianHeadline-Medium',
                fontSize: 24,
                color: color.text,
                ...style,
            }}
        />
    )
}

export const HeadlineCardText = props => (
    <HeadlineText {...props} style={{ fontSize: 16 }} />
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
            style={{
                fontSize: 17,
                fontFamily: 'GuardianTextSans-Regular',
                color: useAppearanceColor().color,
                ...style,
            }}
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
            style={{
                fontSize: 15,
                fontFamily: 'GuardianTextSans-Regular',
                color: useAppearanceColor().dimColor,
                ...style,
            }}
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
                color: useAppearanceColor().color,
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
