import { color } from 'src/theme/color'
import React from 'react'
import { Text, Linking, StyleSheet, TextProps } from 'react-native'

const styles = StyleSheet.create({
    link: {
        color: color.primary,
        textDecorationLine: 'underline',
    },
})

export const Link = ({
    children,
    style,
    href,
}: {
    children: string
    style: TextProps['style']
    href: string
}) => (
    <Text
        style={[styles.link, style]}
        onPress={() => {
            Linking.openURL(href)
        }}
    >
        {children}
    </Text>
)
