import React from 'react'
import { StyleSheet, SafeAreaView } from 'react-native'
import { color } from 'src/theme/color'
import { OnboardingCard } from 'src/components/onboarding/onboarding-card'
import { Button } from 'src/components/button/button'
import { metrics } from 'src/theme/spacing'
import { FEEDBACK_EMAIL } from 'src/helpers/words'

const styles = StyleSheet.create({
    card: {
        width: '100%',
        marginBottom: metrics.horizontal * 2,
    },
})

const OnboardingIntro = ({ onContinue }: { onContinue: () => void }) => {
    return (
        <>
            <OnboardingCard
                style={styles.card}
                title="Welcome to the Guardian daily"
                subtitle="Thank you for being a beta user"
            >
                {`Send us your thoughts and bugs to ${FEEDBACK_EMAIL}`}
            </OnboardingCard>
            <Button onPress={onContinue}>Start</Button>
        </>
    )
}

export { OnboardingIntro }
