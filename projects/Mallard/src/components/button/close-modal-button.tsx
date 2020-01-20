import React from 'react'
import { StyleSheet } from 'react-native'
import { Button } from '../button/button'
import { color } from 'src/theme/color'

const closeModalButtonStyles = (buttonColor?: string) =>
    StyleSheet.create({
        dismissText: {
            color: buttonColor ? 'white' : color.primary,
        },
        dismissButton: {
            paddingHorizontal: 0,
            backgroundColor: buttonColor ? buttonColor : 'transparent',
            borderColor: buttonColor ? buttonColor : color.primary,
            borderWidth: 1,
        },
    })

// const buttonColorStyle = (buttonColor: string) =>
//     StyleSheet.create({
//         style: {
//             backgroundColor: buttonColor,
//             borderWidth: 0,
//         },
//     })

const CloseModalButton = ({
    onPress,
    color,
}: {
    onPress: () => void
    color?: string
}) => {
    return (
        <Button
            icon=""
            alt="Dismiss"
            buttonStyles={[closeModalButtonStyles(color).dismissButton]}
            textStyles={closeModalButtonStyles(color).dismissText}
            onPress={onPress}
        />
    )
}

export { CloseModalButton }
