import React from 'react'
import { View, Button, Text, StyleSheet } from 'react-native'
import { useSettings } from 'src/hooks/use-settings'

const styles = StyleSheet.create({
    background: {
        backgroundColor: 'white',
        height: '100%',
        display: 'flex',
        justifyContent: 'center',
        alignItems: 'center',
    },
})

const OnboardingHandler = ({ onComplete }: { onComplete: () => void }) => {
    const [, setSetting] = useSettings()
    return (
        <View style={styles.background}>
            <Text>Do some of the onboarding stuff</Text>
            <Button
                title="Finish onboarding"
                onPress={() => {
                    setSetting('hasOnboarded', true)
                    onComplete()
                }}
            >
                Finish
            </Button>
        </View>
    )
}

export { OnboardingHandler }
