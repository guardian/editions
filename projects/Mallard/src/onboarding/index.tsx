import React from 'react'
import { View, Button, Text, StyleSheet } from 'react-native'

const styles = StyleSheet.create({
    background: {
        backgroundColor: 'white',
        height: '100%',
        display: 'flex',
        justifyContent: 'center',
        alignItems: 'center',
    },
})

const OnboardingHandler = ({ onComplete }: { onComplete: () => void }) => (
    <View style={styles.background}>
        <Text>Do some of the onboarding stuff</Text>
        <Button title="Finish onboarding" onPress={() => onComplete()}>
            Finish
        </Button>
    </View>
)

export { OnboardingHandler }
