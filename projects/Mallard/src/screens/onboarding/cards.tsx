import React from 'react'
import { StyleSheet, View } from 'react-native'
import {
    OnboardingCard,
    CardAppearance,
} from 'src/components/onboarding/onboarding-card'
import { Button, ButtonAppearance } from 'src/components/button/button'
import { metrics } from 'src/theme/spacing'
import { FEEDBACK_EMAIL } from 'src/helpers/words'
import { useGdprSwitches } from 'src/hooks/use-settings'

const Aligner = ({ children }: { children: React.ReactNode }) => (
    <View
        style={{
            flexDirection: 'column',
            flex: 1,
            alignItems: 'stretch',
            justifyContent: 'space-around',
        }}
    >
        {children}
    </View>
)

const styles = StyleSheet.create({
    card: {
        marginBottom: metrics.horizontal * 2,
    },
    sbs: {
        flexDirection: 'row',
        justifyContent: 'space-between',
    },
})

const OnboardingIntro = ({ onContinue }: { onContinue: () => void }) => {
    return (
        <Aligner>
            <OnboardingCard
                style={styles.card}
                title="Welcome to the Guardian daily"
                explainerTitle="Thank you for being a beta user"
            >
                {`Send us your thoughts and bugs to ${FEEDBACK_EMAIL}`}
            </OnboardingCard>
            <View style={styles.sbs}>
                <Button
                    appearance={ButtonAppearance.tomato}
                    onPress={onContinue}
                    style={{ marginLeft: 'auto' }} // keep the button to the right
                >
                    Start
                </Button>
            </View>
        </Aligner>
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
        <Aligner>
            <OnboardingCard
                style={styles.card}
                appearance={CardAppearance.apricot}
                title="We care about your privacy"
                explainerTitle="We won’t share your data without asking"
            >
                {`(temporary copy) By clicking agree you are agreeing to The Guardian’s privacy policy and data usage`}
            </OnboardingCard>
            <View style={styles.sbs}>
                <Button
                    appearance={ButtonAppearance.apricot}
                    onPress={onOpenGdprConsent}
                >
                    Customize
                </Button>
                <Button
                    appearance={ButtonAppearance.apricot}
                    onPress={() => {
                        enableNulls()
                        onContinue()
                    }}
                >
                    Agree
                </Button>
            </View>
        </Aligner>
    )
}

export { OnboardingIntro, OnboardingConsent }
