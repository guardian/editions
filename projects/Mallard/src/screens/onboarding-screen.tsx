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

const IllustrationStyles = StyleSheet.create({
    postion: {
        position: 'absolute',
        bottom: 0,
        left: 0,
        height: '15%',
        right: 0,
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
            <View style={[IllustrationStyles.postion]}>
                <Image
                    style={[
                        {
                            width: '100%',
                            height: '100%',
                        },
                    ]}
                    resizeMode={'contain'}
                    source={require('src/assets/images/privacy.png')}
                />
            </View>
        </Frame>
    )
}

export { OnboardingConsentScreen }
