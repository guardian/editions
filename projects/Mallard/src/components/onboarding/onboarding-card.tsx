import React from 'react'
import { View, ViewStyle, StyleProp } from 'react-native'
import { HeadlineCardText, TitlepieceText } from '../styled-text'
import { UiBodyCopy } from 'src/components/styled-text'
import { color } from 'src/theme/color'
import { metrics } from 'src/theme/spacing'

const OnboardingCard = ({
    children,
    title,
    style,
}: {
    children: string
    title: string
    style: StyleProp<ViewStyle>
}) => (
    <View style={style}>
        <View
            style={{
                backgroundColor: color.palette.news.bright,
                aspectRatio: 1,
                padding: metrics.horizontal,
                paddingVertical: metrics.vertical,
            }}
        >
            <TitlepieceText
                style={{
                    color: color.palette.neutral[100],
                    fontSize: 50,
                    lineHeight: 50,
                }}
            >
                {title}
            </TitlepieceText>
        </View>
        <View
            style={{
                backgroundColor: color.background,
                padding: metrics.horizontal,
                paddingVertical: metrics.vertical,
            }}
        >
            <UiBodyCopy>{children}</UiBodyCopy>
        </View>
    </View>
)

export { OnboardingCard }
