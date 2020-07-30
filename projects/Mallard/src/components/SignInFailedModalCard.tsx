import React from 'react'
import { OnboardingCard, CardAppearance } from './onboarding/onboarding-card'
import { View, StyleSheet } from 'react-native'
import { ModalButton } from './Button/ModalButton'
import { UiBodyCopy } from './styled-text'
import { metrics } from 'src/theme/spacing'
import {
    APPLE_RELAY_TITLE,
    APPLE_RELAY_BODY,
    APPLE_RELAY_RETRY,
    SIGN_IN_FAILED_TITLE,
    CUSTOMER_HELP_EMAIL,
    SIGN_IN_FAILED_BODY,
    SIGN_IN_FAILED_RETRY,
} from 'src/helpers/words'

const styles = StyleSheet.create({
    bottomContentContainer: {
        display: 'flex',
        flexDirection: 'row',
        alignItems: 'center',
        justifyContent: 'space-between',
        marginTop: metrics.vertical * 2,
    },
})

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
              title: APPLE_RELAY_TITLE,
              bodyCopy: APPLE_RELAY_BODY,
              tryAgainText: APPLE_RELAY_RETRY,
          }
        : {
              title: SIGN_IN_FAILED_TITLE,
              bodyCopy: `We were unable to find a subscription associated with ${email}. Try signing in with a different email or contact us at ${CUSTOMER_HELP_EMAIL}`,
              tryAgainText: SIGN_IN_FAILED_RETRY,
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
