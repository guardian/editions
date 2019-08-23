import React, { ReactNode } from 'react'
import { StyleSheet, StyleProp, TextStyle, View, ViewStyle } from 'react-native'
import { color } from 'src/theme/color'
import { IssueTitleText } from '../styled-text'
import { metrics } from 'src/theme/spacing'
import { families } from 'src/theme/typography'
import { WithBreakpoints } from '../layout/ui/sizing/with-breakpoints'
import { Breakpoints } from 'src/theme/breakpoints'

const splitStyles = StyleSheet.create({
    container: {
        flexDirection: 'row',
        justifyContent: 'flex-end',
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
        Pick<
            ViewStyle,
            | 'paddingTop'
            | 'paddingVertical'
            | 'paddingBottom'
            | 'marginTop'
            | 'marginVertical'
            | 'marginBottom'
            | 'height'
        >
    >
}) => {
    const Inner = ({ width }: { width: number }) => (
        <View style={[splitStyles.container, style]}>
            {proxy && <View style={{ flexGrow: 1 }}>{proxy}</View>}
            <View style={[splitStyles.inner, { width }]}>{children}</View>
        </View>
    )

    return (
        <WithBreakpoints>
            {{
                0: ({ width }) => (
                    <Inner width={metrics.gridRowSplit.narrow(width)} />
                ),
                [Breakpoints.tabletVertical]: () => (
                    <Inner width={metrics.gridRowSplit.wide} />
                ),
            }}
        </WithBreakpoints>
    )
}

const styles = StyleSheet.create({
    text: {
        marginTop: -2,
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
