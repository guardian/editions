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
import { useAppAppearance } from 'src/theme/appearance'
import { metrics } from 'src/theme/spacing'
import { color } from 'src/theme/color'

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
    issueTitleText: {
        fontFamily: 'GTGuardianTitlepiece-Bold',
        fontSize: 24,
        lineHeight: 24,
    },
    titlepieceText: {
        fontFamily: 'GTGuardianTitlepiece-Bold',
        fontSize: 30,
        lineHeight: 30,
    },
    headlineKickerText: {
        fontFamily: 'GTGuardianTitlepiece-Bold',
        marginBottom: metrics.vertical / 8,
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
    return <Text {...props} style={[styles.headlineKickerText, style]} />
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
