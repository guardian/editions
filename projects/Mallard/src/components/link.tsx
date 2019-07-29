import { string } from 'prop-types'
import { color } from 'src/theme/color'
import React from 'react'
import { Text, Linking, StyleSheet } from 'react-native'

const style = StyleSheet.create({
    link: {
        color: color.primary,
        textDecorationLine: 'underline',
    },
})

export const Link = ({
    children,
    href,
}: {
    children: string
    href: string
}) => (
    <Text
        style={style.link}
        onPress={() => {
            Linking.openURL(href)
        }}
    >
        {children}
    </Text>
)
