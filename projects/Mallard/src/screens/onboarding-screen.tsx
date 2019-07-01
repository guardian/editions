import React, { ReactNode } from 'react'
import { StyleSheet, SafeAreaView, View } from 'react-native'
import { useSettings } from 'src/hooks/use-settings'
import { color } from 'src/theme/color'
import { metrics } from 'src/theme/spacing'
import { OnboardingIntro, OnboardingConsent } from './onboarding/cards'

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
})

const Frame = ({ children }: { children: ReactNode }) => (
    <SafeAreaView style={styles.background}>
        <View style={styles.padding}>{children}</View>
    </SafeAreaView>
)

const OnboardingIntroScreen = ({ onContinue }: { onContinue: () => void }) => {
    const [, setSetting] = useSettings()
    return (
        <Frame>
            <OnboardingIntro
                onContinue={() => {
                    onContinue()
                }}
            />
        </Frame>
    )
}

const OnboardingConsentScreen = ({
    onOpenGdprConsent,
    onContinue,
}: {
    onOpenGdprConsent: () => void
    onContinue: () => void
}) => {
    const [, setSetting] = useSettings()
    return (
        <Frame>
            <OnboardingConsent
                {...{ onOpenGdprConsent }}
                onContinue={() => {
                    onOpenGdprConsent()
                    setSetting('hasOnboarded', true)
                    onContinue()
                }}
            />
        </Frame>
    )
}

export { OnboardingIntroScreen, OnboardingConsentScreen }
