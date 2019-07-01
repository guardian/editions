import React from 'react'
import { StyleSheet, View } from 'react-native'
import { OnboardingCard } from 'src/components/onboarding/onboarding-card'
import { Button } from 'src/components/button/button'
import { metrics } from 'src/theme/spacing'
import { FEEDBACK_EMAIL } from 'src/helpers/words'
import { useGdprSwitches } from 'src/hooks/use-settings'

const styles = StyleSheet.create({
    card: {
        width: '100%',
        marginBottom: metrics.horizontal * 2,
    },
    sbs: {
        flexDirection: 'row',
        width: '100%',
        justifyContent: 'space-between',
    },
})

const OnboardingIntro = ({ onContinue }: { onContinue: () => void }) => {
    return (
        <>
            <OnboardingCard
                style={styles.card}
                title="Welcome to the Guardian daily"
                subtitle="Thank you for being a beta user"
            >
                {`Send us your thoughts and bugs to ${FEEDBACK_EMAIL}`}
            </OnboardingCard>
            <Button onPress={onContinue}>Start</Button>
        </>
    )
}

const OnboardingConsent = ({
    onOpenGdprConsent,
    onContinue,
}: {
    onOpenGdprConsent: () => void
    onContinue: () => void
}) => {
    const { enableNulls } = useGdprSwitches()
    return (
        <>
            <OnboardingCard
                style={styles.card}
                title="We care about your privacy"
                subtitle="We won’t share your data without asking"
            >
                {`(temporary copy) By clicking agree you are agreeing to The Guardian’s privacy policy and data usage`}
            </OnboardingCard>
            <View style={styles.sbs}>
                <Button onPress={onOpenGdprConsent}>Customize</Button>
                <Button
                    onPress={() => {
                        enableNulls()
                        onContinue()
                    }}
                >
                    Agree
                </Button>
            </View>
        </>
    )
}

export { OnboardingIntro, OnboardingConsent }
