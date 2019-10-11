import React from 'react'
import { OnboardingCard, CardAppearance } from './onboarding/onboarding-card'
import { View, Platform, Linking, StyleSheet } from 'react-native'
import { ModalButton } from './modal-button'
import { Link } from './link'
import { ButtonAppearance } from './button/button'
import { getFont } from 'src/theme/typography'
import { sendComponentEvent, ComponentType, Action } from 'src/services/ophan'

const styles = StyleSheet.create({
    bottomContentContainer: {
        display: 'flex',
        flexDirection: 'row',
        alignItems: 'center',
        justifyContent: 'space-between',
        flexGrow: 1,
        marginRight: 15,
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
        onDismissThisCard={onDismiss}
        title="Already a subscriber?"
        subtitle="Sign in with your subscriber details to continue"
        appearance={CardAppearance.blue}
        size="medium"
        bottomContent={
            <>
                <View style={styles.bottomContentContainer}>
                    <ModalButton
                        onPress={() => {
                            close()
                            onLoginPress()
                            sendComponentEvent({
                                componentType: ComponentType.appButton,
                                action: Action.click,
                                value: 'sign_in_continue_clicked',
                            })
                        }}
                    >
                        Sign in
                    </ModalButton>
                    <Link
                        style={{ ...getFont('sans', 0.9, 'bold') }}
                        href="https://www.theguardian.com/help/identity-faq"
                    >
                        Need help signing in?
                    </Link>
                </View>
            </>
        }
        explainerTitle="Not subscribed yet?"
        explainerSubtitle={
            Platform.OS === 'ios'
                ? 'Get the Daily with a digital subscription from The Guardian website.'
                : 'Read the Daily with a digital subscription from The Guardian.'
        }
        bottomExplainerContent={
            <>
                {/* Added only for Android - https://trello.com/c/FsoQQx3m/707-already-a-subscriber-hide-the-learn-more-button */}
                {Platform.OS === 'android' ? (
                    <ModalButton
                        onPress={() => {
                            Linking.openURL(
                                'https://support.theguardian.com/uk/subscribe/digital',
                            )
                        }}
                        buttonAppearance={ButtonAppearance.dark}
                    >
                        {'Start your free 14 day trial'}
                    </ModalButton>
                ) : null}
                {/* Being hidden temporarily - https://trello.com/c/FsoQQx3m/707-already-a-subscriber-hide-the-learn-more-button */}
                {/* <ModalButton
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
                </ModalButton> */}
            </>
        }
    />
)

export { SignInModalCard }
