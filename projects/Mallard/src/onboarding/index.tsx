import React from 'react'
import { Text, StyleSheet, SafeAreaView, View } from 'react-native'
import { useSettings } from 'src/hooks/use-settings'
import { color } from 'src/theme/color'
import { OnboardingCard } from 'src/components/onboarding/onboarding-card'
import { Button } from 'src/components/button/button'
import { metrics } from 'src/theme/spacing'

const styles = StyleSheet.create({
    background: {
        backgroundColor: color.palette.brand.main,
        flex: 1,
        display: 'flex',
        justifyContent: 'center',
    },
    padding: {
        display: 'flex',
        alignItems: 'flex-end',
        padding: metrics.horizontal * 2,
    },
    card: {
        width: '100%',
        marginBottom: metrics.horizontal * 2,
    },
})

const OnboardingHandler = ({ onComplete }: { onComplete: () => void }) => {
    const [, setSetting] = useSettings()
    return (
        <SafeAreaView style={styles.background}>
            <View style={styles.padding}>
                <OnboardingCard style={styles.card} title="Welcome to the beta">
                    asdf
                </OnboardingCard>
                <Button
                    onPress={() => {
                        setSetting('hasOnboarded', true)
                        onComplete()
                    }}
                >
                    Finish onboarding
                </Button>
            </View>
        </SafeAreaView>
    )
}

export { OnboardingHandler }
