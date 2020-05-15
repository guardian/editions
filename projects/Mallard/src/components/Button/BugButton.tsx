import React from 'react'
import { Button } from './Button'
import { StyleSheet } from 'react-native'

const styles = StyleSheet.create({
    button: {
        position: 'absolute',
        bottom: 20,
        right: 20,
        zIndex: 9999,
    },
})

const BugButton = ({ onPress }: { onPress: () => void }) => (
    <Button
        accessibilityLabel="Report a bug button"
        accessibilityHint="Opens a dialog asking if you want to include diagnostic information to your report"
        style={styles.button}
        onPress={onPress}
        alt="Report a bug"
        icon=""
    />
)

export { BugButton }
