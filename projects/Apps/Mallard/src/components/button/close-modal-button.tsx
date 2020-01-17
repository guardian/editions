import React from 'react'
import { StyleSheet } from 'react-native'
import { Button } from '../button/button'
import { color } from 'src/theme/color'

const closeModalButtonStyles = StyleSheet.create({
    dismissButton: {
        paddingHorizontal: 0,
        backgroundColor: 'transparent',
        borderColor: color.primary,
        borderWidth: 1,
    },
    dismissText: {
        color: color.primary,
    },
})

const CloseModalButton = ({ onPress }: { onPress: () => void }) => (
    <Button
        icon=""
        alt="Dismiss"
        buttonStyles={closeModalButtonStyles.dismissButton}
        textStyles={closeModalButtonStyles.dismissText}
        onPress={onPress}
    />
)

export { CloseModalButton }
