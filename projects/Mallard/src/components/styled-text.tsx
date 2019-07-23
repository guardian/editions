import React from 'react'
import {
    Text,
    View,
    StyleSheet,
    TextStyle,
    StyleProp,
    TextProps,
    ViewStyle,
} from 'react-native'
import { useAppAppearance, useArticleToneColor } from 'src/theme/appearance'
import { metrics } from 'src/theme/spacing'
import { color } from 'src/theme/color'
import { getFont } from 'src/theme/typography'

const cardStyles = {
    default: {
        fontSize: 18,
        lineHeight: 21,
    },
}

const styles = StyleSheet.create({
    headlineText: {
        flexShrink: 0,
        fontFamily: 'GHGuardianHeadline-Regular',
        fontSize: 28,
        lineHeight: 30,
        marginTop: 4,
        color: color.text,
    },
    issueTitleText: {
        flexShrink: 0,
        fontFamily: 'GTGuardianTitlepiece-Bold',
        fontSize: 24,
        lineHeight: 24,
    },
    titlepieceText: {
        flexShrink: 0,
        fontFamily: 'GTGuardianTitlepiece-Bold',
        fontSize: 30,
        lineHeight: 30,
    },
    headlineKickerText: {
        flexShrink: 0,
        fontFamily: 'GTGuardianTitlepiece-Bold',
        marginTop: 2,
        ...cardStyles.default,
    },
    headlineCardText: {
        flexShrink: 0,
        ...cardStyles.default,
    },
    standfirstText: {
        flexShrink: 0,
        ...getFont('text', 1),
    },
    serifBodyCopy: {
        flexShrink: 0,
        ...getFont('text', 1),
    },
    bodyCopy: {
        flexShrink: 0,
        ...getFont('sans', 1),
    },
    explainerCopy: {
        flexShrink: 0,
        ...getFont('sans', 0.9),
    },
})

export const TitlepieceText = ({
    style,
    ...props
}: {
    children: string
    style?: StyleProp<TextStyle>
} & TextProps) => {
    return <Text {...props} style={[styles.titlepieceText, style]} />
}

export const IssueTitleText = ({
    style,
    ...props
}: {
    children: string
    style?: StyleProp<TextStyle>
} & TextProps) => {
    return <Text {...props} style={[styles.issueTitleText, style]} />
}

export const HeadlineText = ({
    style,
    ...props
}: {
    children: string
    style?: StyleProp<TextStyle>
} & TextProps) => {
    return <Text {...props} style={[styles.headlineText, style]} />
}

export const HeadlineKickerText = ({
    style,
    ...props
}: {
    children: string
    style?: StyleProp<TextStyle>
} & TextProps) => {
    return (
        <Text
            {...props}
            style={[
                styles.headlineKickerText,
                style,
                { color: useArticleToneColor() },
            ]}
        />
    )
}

export const StandfirstText = ({
    style,
    ...props
}: {
    children: string
    style?: StyleProp<TextStyle>
} & TextProps) => {
    return <Text {...props} style={[styles.standfirstText, style]} />
}

export const HeadlineCardText = ({
    children,
    style,
    ...props
}: {
    children: string
    style?: StyleProp<TextStyle>
} & TextProps) => (
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
    style?: StyleProp<TextStyle>
} & TextProps) => {
    return (
        <Text
            {...props}
            style={[
                styles.serifBodyCopy,
                weight === 'bold' && {
                    fontFamily: 'GuardianTextEgyptian-Bold',
                },
                style
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
    style?: StyleProp<TextStyle>
} & TextProps) => {
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
    style?: StyleProp<TextStyle>
} & TextProps) => {
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
    children: string
    style?: StyleProp<ViewStyle>
}) => {
    return (
        <View
            {...props}
            style={[
                style,
                {
                    padding: metrics.vertical,
                    paddingHorizontal: metrics.horizontal,
                    alignItems: 'center',
                },
            ]}
        >
            <UiExplainerCopy style={{ textAlign: 'center' }}>
                {children}
            </UiExplainerCopy>
        </View>
    )
}
