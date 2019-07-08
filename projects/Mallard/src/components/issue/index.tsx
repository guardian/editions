import React, { ReactNode } from 'react'
import {
    Text,
    StyleSheet,
    StyleProp,
    TextStyle,
    View,
    ViewStyle,
} from 'react-native'
import { color } from 'src/theme/color'
import { metrics } from 'src/theme/spacing'
import { IssueTitleText } from '../styled-text'

const splitStyles = StyleSheet.create({
    container: { flexDirection: 'row', justifyContent: 'flex-end' },
    inner: {
        flexDirection: 'row',
        justifyContent: 'flex-start',
        flex: 0,
    },
})

const IssueRowSplit = ({
    children,
    style,
}: {
    children: ReactNode
    style?: StyleProp<
        Pick<ViewStyle, 'paddingTop' | 'paddingVertical' | 'paddingBottom'>
    >
}) => {
    const width = metrics.issueHeaderSplit()
    return (
        <View style={[splitStyles.container, style]}>
            <View style={[splitStyles.inner, { width }]}>{children}</View>
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
}

export interface IssueTitleProps {
    title: string
    subtitle?: string
}

const appearances: {
    [key in IssueTitleAppearance]: {
        subtitle: StyleProp<TextStyle>
    }
} = {
    [IssueTitleAppearance.default]: StyleSheet.create({
        subtitle: { color: color.palette.highlight.main },
    }),
    [IssueTitleAppearance.ocean]: StyleSheet.create({
        subtitle: { color: color.palette.sport.bright },
    }),
}

const IssueTitle = ({
    title,
    subtitle,
    appearance,
}: IssueTitleProps & { appearance: IssueTitleAppearance }) => (
    <View>
        <IssueTitleText style={styles.text}>{title}</IssueTitleText>
        {subtitle && (
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

export { IssueTitle, IssueRowSplit }
