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

const SignInFailedModalCard = ({
    close,
    onLoginPress,
    onOpenCASLogin,
    onDismiss,
    email,
}: {
    close: () => void
    onLoginPress: () => void
    onOpenCASLogin: () => void
    onDismiss: () => void
    email: string
}) => (
    <OnboardingCard
        title="Subscription not found"
        appearance={CardAppearance.blue}
        onDismissThisCard={() => {
            close()
            onDismiss()
        }}
        size="small"
        bottomContent={
            <>
                <UiBodyCopy weight="bold">{`We were unable to find a subscription associated with ${email}. Try signing in with a different email or contact us at ${CUSTOMER_HELP_EMAIL}`}</UiBodyCopy>
                <View style={styles.bottomContentContainer}>
                    <View>
                        <ModalButton
                            onPress={() => {
                                close()
                                onLoginPress()
                            }}
                        >
                            Try a different email
                        </ModalButton>
                        <ModalButton
                            onPress={() => {
                                close()
                                onOpenCASLogin()
                            }}
                        >
                            Activate with subscriber ID
                        </ModalButton>
                    </View>
                </View>
            </>
        }
    />
)

export { SignInFailedModalCard }
