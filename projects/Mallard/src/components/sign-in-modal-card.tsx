import React from 'react'
import { OnboardingCard, CardAppearance } from './onboarding/onboarding-card'
import { View, Platform, Linking, StyleSheet } from 'react-native'
import { ModalButton } from './modal-button'
import { Link } from './link'
import { ButtonAppearance } from './button/button'
import { getFont } from 'src/theme/typography'

const styles = StyleSheet.create({
    bottomContentContainer: {
        display: 'flex',
        flexDirection: 'row',
        alignItems: 'center',
        justifyContent: 'space-between',
    },
})

const SignInModalCard = ({
    close,
    onLoginPress,
    onDismiss,
}: {
    close: () => void
    onLoginPress: () => void
    onDismiss: () => void
}) => (
    <OnboardingCard
        title="Already a subscriber?"
        subtitle="Sign in to continue with the app"
        appearance={CardAppearance.blue}
        size="small"
        bottomContent={
            <>
                <View style={styles.bottomContentContainer}>
                    <View>
                        <ModalButton
                            onPress={() => {
                                close()
                                onLoginPress()
                            }}
                        >
                            Continue
                        </ModalButton>
                    </View>
                    <View>
                        <Link
                            style={{ ...getFont('sans', 0.9, 'bold') }}
                            href="https://www.theguardian.com/help/identity-faq"
                        >
                            Need help signing in?
                        </Link>
                    </View>
                </View>
            </>
        }
        explainerTitle="Not subscribed yet?"
        explainerSubtitle={
            Platform.OS === 'ios'
                ? 'To get a free trial with our Digital Pack, visit our website'
                : 'Get a free trial with our Digital Pack'
        }
        bottomExplainerContent={
            <>
                <ModalButton
                    onPress={() => {
                        if (Platform.OS === 'android') {
                            Linking.openURL(
                                'https://support.theguardian.com/uk/subscribe/digital',
                            )
                        }
                    }}
                    buttonAppearance={ButtonAppearance.dark}
                >
                    {Platform.OS === 'ios'
                        ? 'Learn more'
                        : 'Get your free 14 day trial'}
                </ModalButton>
            </>
        }
    />
)

export { SignInModalCard }
