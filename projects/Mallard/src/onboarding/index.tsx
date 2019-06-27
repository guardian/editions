import React from 'react'
import { Text, StyleSheet, SafeAreaView, View } from 'react-native'
import { useSettings } from 'src/hooks/use-settings'
import { color } from 'src/theme/color'
import { OnboardingCard } from 'src/components/onboarding/onboarding-card'
import { Button } from 'src/components/button/button'
import { metrics } from 'src/theme/spacing'
import { FEEDBACK_EMAIL } from 'src/helpers/words'

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
        justifyContent: 'flex-end',
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
                    {`Pardon our dust, we are getting things ready. If you notice anything odd let us know at ${FEEDBACK_EMAIL}`}
                </OnboardingCard>
                <Button
                    onPress={() => {
                        setSetting('hasOnboarded', true)
                        onComplete()
                    }}
                >
                    Start
                </Button>
            </View>
        </SafeAreaView>
    )
}

export { OnboardingHandler }
