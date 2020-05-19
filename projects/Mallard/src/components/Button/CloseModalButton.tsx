import React from 'react'
import { StyleSheet } from 'react-native'
import { Button } from './Button'
import { color } from 'src/theme/color'

const closeModalButtonStyles = (bgColor?: string, borderColor?: string) =>
    StyleSheet.create({
        dismissText: {
            color: bgColor ? 'white' : color.primary,
        },
        dismissButton: {
            paddingHorizontal: 0,
            backgroundColor: bgColor ? bgColor : 'transparent',
            borderColor: borderColor ? borderColor : color.primary,
            borderWidth: 1,
        },
    })

const CloseModalButton = ({
    onPress,
    bgColor,
    borderColor,
}: {
    onPress: () => void
    bgColor?: string
    borderColor?: string
}) => {
    return (
        <Button
            icon=""
            alt="Dismiss"
            buttonStyles={[
                closeModalButtonStyles(bgColor, borderColor).dismissButton,
            ]}
            textStyles={
                closeModalButtonStyles(bgColor, borderColor).dismissText
            }
            onPress={onPress}
        />
    )
}

export { CloseModalButton }
