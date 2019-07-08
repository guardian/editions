import React from 'react'
import { Text, StyleSheet, StyleProp, TextStyle, View } from 'react-native'
import { color } from 'src/theme/color'

const styles = StyleSheet.create({
    text: {
        fontFamily: 'GTGuardianTitlepiece-Bold',
        fontSize: 24,
        lineHeight: 24,
        color: color.textOverPrimary,
    },
})

export enum TitleAppearance {
    default,
    ocean,
}

export interface TitleProps {
    title: string
    subtitle?: string
}

const appearances: {
    [key in TitleAppearance]: {
        subtitle: StyleProp<TextStyle>
    }
} = {
    [TitleAppearance.default]: StyleSheet.create({
        subtitle: { color: color.palette.highlight.main },
    }),
    [TitleAppearance.ocean]: StyleSheet.create({
        subtitle: { color: color.palette.sport.bright },
    }),
}

const Title = ({
    title,
    subtitle,
    appearance,
}: TitleProps & { appearance: TitleAppearance }) => (
    <View>
        <Text style={styles.text}>{title}</Text>
        {subtitle && (
            <Text style={[styles.text, appearances[appearance].subtitle]}>
                {subtitle}
            </Text>
        )}
    </View>
)
Title.defaultProps = {
    appearance: TitleAppearance.default,
}

export { Title }
