import React from 'react'
import { OnboardingCard, CardAppearance } from './onboarding/onboarding-card'
import { View } from 'react-native'
import { ModalButton } from './modal-button'
import { Link } from './link'

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
        title="Already subscribed?"
        subtitle="Sign in to continue with the app"
        appearance={CardAppearance.blue}
        size="small"
        bottomContent={
            <>
                <View style={{ width: '100%' }}>
                    <Link href="https://www.theguardian.com/help/identity-faq">
                        Need help signing in?
                    </Link>
                </View>
                <ModalButton
                    onPress={() => {
                        close()
                        onLoginPress()
                    }}
                >
                    Continue
                </ModalButton>
                <ModalButton
                    onPress={() => {
                        close()
                        onDismiss()
                    }}
                >
                    Close
                </ModalButton>
            </>
        }
        explainerTitle="Not subscribed yet?"
        explainerSubtitle="Check the benefits of the digital pack"
    >
        Not subscribed yet? Learn more ...
    </OnboardingCard>
)

export { SignInModalCard }
