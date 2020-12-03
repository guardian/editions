import React from 'react'
import { Button, ButtonAppearance } from './Button'
import { StyleSheet, StyleProp, ViewStyle, TextStyle } from 'react-native'
const styles = StyleSheet.create({
    button: {
        marginTop: 10,
        marginRight: 10,
    },
})

const ModalButton = (props: {
    onPress: () => void
    children: string
    alt?: string
    buttonStyles?: StyleProp<ViewStyle>
    textStyles?: StyleProp<TextStyle>
    buttonAppearance?: ButtonAppearance
}) => (
    <Button
        {...props}
        alt={props.alt || props.children}
        style={styles.button}
        buttonStyles={props.buttonStyles}
        textStyles={props.textStyles}
        appearance={props.buttonAppearance || ButtonAppearance.light}
    />
)

export { ModalButton }
