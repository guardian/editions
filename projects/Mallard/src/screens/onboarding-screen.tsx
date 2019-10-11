import React, { ReactNode } from 'react'
import { StyleSheet, SafeAreaView, View, Image } from 'react-native'
import { useSettings } from 'src/hooks/use-settings'
import { color } from 'src/theme/color'
import { metrics } from 'src/theme/spacing'
import { OnboardingConsent } from './onboarding/cards'

const styles = StyleSheet.create({
    background: {
        backgroundColor: color.palette.neutral[93],
        flex: 1,
        display: 'flex',
        justifyContent: 'center',
    },
    padding: {
        display: 'flex',
        flex: 1,
        alignItems: 'center',
        padding: metrics.horizontal * 2,
    },
})

const Frame = ({ children }: { children: ReactNode }) => (
    <SafeAreaView style={styles.background}>
        <View style={styles.padding}>{children}</View>
    </SafeAreaView>
)

const OnboardingConsentScreen = ({
    onOpenGdprConsent,
    onContinue,
    onOpenPrivacyPolicy,
}: {
    onOpenGdprConsent: () => void
    onContinue: () => void
    onOpenPrivacyPolicy: () => void
}) => {
    const setSetting = useSettings()
    return (
        <Frame>
            <OnboardingConsent
                {...{
                    onOpenGdprConsent,
                    onOpenPrivacyPolicy,
                }}
                onContinue={() => {
                    onOpenGdprConsent()
                    setSetting('hasOnboarded', true)
                    onContinue()
                }}
            />
        </Frame>
    )
}

export { OnboardingConsentScreen }
