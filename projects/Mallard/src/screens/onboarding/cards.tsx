import React, { useEffect } from 'react'
import { StyleSheet } from 'react-native'
import { OnboardingCard } from 'src/components/onboarding/onboarding-card'
import { Button } from 'src/components/button/button'
import { metrics } from 'src/theme/spacing'
import { FEEDBACK_EMAIL } from 'src/helpers/words'
import { useGdprSwitches } from '../settings/gdpr-consent-screen'

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
    const { enableEverything } = useGdprSwitches()
    useEffect(() => {
        enableEverything()
    }, [])
    return (
        <>
            <OnboardingCard
                style={styles.card}
                title="We care about your privacy"
                subtitle="And thats why the large button gives us all your data"
            >
                {`Send us your thoughts and bugs to ${FEEDBACK_EMAIL}`}
            </OnboardingCard>
            <Button onPress={onOpenGdprConsent}>Customize</Button>
            <Button onPress={onContinue}>Start</Button>
        </>
    )
}

export { OnboardingIntro, OnboardingConsent }
