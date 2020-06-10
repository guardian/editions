import React from 'react'
import { OnboardingCard, CardAppearance } from './onboarding/onboarding-card'
import { View, StyleSheet } from 'react-native'
import { ModalButton } from './Button/ModalButton'
import { UiBodyCopy } from './styled-text'
import { metrics } from 'src/theme/spacing'

const styles = StyleSheet.create({
    bottomContentContainer: {
        display: 'flex',
        flexDirection: 'row',
        alignItems: 'center',
        justifyContent: 'space-between',
        marginTop: metrics.vertical * 2,
    },
})

const CUSTOMER_HELP_EMAIL = 'customer.help@theguardian.com'

interface FailureModalText {
    title: string
    bodyCopy: string
    tryAgainText: string
}

const failureModalText = (
    isAppleRelayEmail: boolean,
    email: string,
): FailureModalText => {
    return isAppleRelayEmail
        ? {
              title: 'We are unable to verify your subscription',
              bodyCopy: `As you have chosen not to share your email with us we are unable to detect your subscription. \n \nPlease try a different sign in method. You will need to use the same email address as your Digital subscription. Alternatively, use your subscriber ID.`,
              tryAgainText: 'Try alternative sign in method',
          }
        : {
              title: 'Subscription not found',
              bodyCopy: `We were unable to find a subscription associated with ${email}. Try signing in with a different email or contact us at ${CUSTOMER_HELP_EMAIL}`,
              tryAgainText: 'Try a different email',
          }
}

const SignInFailedModalCard = ({
    close,
    onLoginPress,
    onOpenCASLogin,
    onDismiss,
    onFaqPress,
    email,
}: {
    close: () => void
    onLoginPress: () => void
    onOpenCASLogin: () => void
    onDismiss: () => void
    onFaqPress: () => void
    email: string
}) => {
    const isAppleRelayEmail = email.includes('privaterelay.appleid.com')
    const modalText = failureModalText(isAppleRelayEmail, email)
    return (
        <OnboardingCard
            title={modalText.title}
            appearance={CardAppearance.blue}
            onDismissThisCard={() => {
                close()
                onDismiss()
            }}
            size="small"
            bottomContent={
                <>
                    <UiBodyCopy weight="bold">{modalText.bodyCopy}</UiBodyCopy>
                    <View style={styles.bottomContentContainer}>
                        <View>
                            <ModalButton
                                onPress={() => {
                                    close()
                                    onLoginPress()
                                }}
                            >
                                {modalText.tryAgainText}
                            </ModalButton>
                            <ModalButton
                                onPress={() => {
                                    close()
                                    onOpenCASLogin()
                                }}
                            >
                                Activate with subscriber ID
                            </ModalButton>
                            {isAppleRelayEmail && (
                                <ModalButton
                                    onPress={() => {
                                        close()
                                        onFaqPress()
                                    }}
                                >
                                    How can I sign in with Apple?
                                </ModalButton>
                            )}
                        </View>
                    </View>
                </>
            }
        />
    )
}

export { SignInFailedModalCard }
