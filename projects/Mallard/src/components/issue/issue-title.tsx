import React, { ReactNode } from 'react'
import { StyleSheet, StyleProp, TextStyle, View, ViewStyle } from 'react-native'
import { color } from 'src/theme/color'
import { IssueTitleText } from '../styled-text'
import { useLiveMetrics } from 'src/theme/spacing'
import { families } from 'src/theme/typography'

const splitStyles = StyleSheet.create({
    container: {
        flexDirection: 'row',
        justifyContent: 'flex-end',
        alignItems: 'center',
        width: '100%',
    },
    inner: {
        flexDirection: 'row',
        flex: 0,
    },
})

const GridRowSplit = ({
    children,
    proxy,
    style,
}: {
    children: ReactNode
    proxy?: ReactNode
    style?: StyleProp<
        Pick<ViewStyle, 'paddingTop' | 'paddingVertical' | 'paddingBottom'>
    >
}) => {
    const { gridRowSplit } = useLiveMetrics()
    return (
        <View style={[splitStyles.container, style]}>
            {proxy && <View style={{ flexGrow: 1 }}>{proxy}</View>}
            <View style={[splitStyles.inner, { width: gridRowSplit }]}>
                {children}
            </View>
        </View>
    )
}

const styles = StyleSheet.create({
    text: {
        color: color.textOverPrimary,
    },
})

export enum IssueTitleAppearance {
    default,
    ocean,
    tertiary,
}

export interface IssueTitleProps {
    title: string
    subtitle?: string
    style?: StyleProp<ViewStyle>
}

const appearances: {
    [key in IssueTitleAppearance]: {
        title?: StyleProp<TextStyle>
        subtitle: StyleProp<TextStyle>
    }
} = {
    [IssueTitleAppearance.default]: StyleSheet.create({
        subtitle: { color: color.palette.highlight.main },
    }),
    [IssueTitleAppearance.ocean]: StyleSheet.create({
        subtitle: { color: color.palette.sport.bright },
    }),
    [IssueTitleAppearance.tertiary]: StyleSheet.create({
        title: { color: color.palette.brand.main },
        subtitle: {
            color: color.palette.brand.main,
            fontFamily: families.headline.regular,
        },
    }),
}

const IssueTitle = ({
    title,
    subtitle,
    appearance,
    style,
}: IssueTitleProps & { appearance: IssueTitleAppearance }) => (
    <View style={style}>
        <IssueTitleText style={[styles.text, appearances[appearance].title]}>
            {title}
        </IssueTitleText>
        {!!subtitle && (
            <IssueTitleText
                style={[styles.text, appearances[appearance].subtitle]}
            >
                {subtitle}
            </IssueTitleText>
        )}
    </View>
)
IssueTitle.defaultProps = {
    appearance: IssueTitleAppearance.default,
}

export { IssueTitle, GridRowSplit }
