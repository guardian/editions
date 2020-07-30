import React from 'react'
import { OnboardingCard, CardAppearance } from './onboarding/onboarding-card'
import { View, Platform, Linking, StyleSheet } from 'react-native'
import { ModalButton } from './Button/ModalButton'
import { Link } from './link'
import { ButtonAppearance } from './Button/Button'
import { getFont } from 'src/theme/typography'
import { sendComponentEvent, ComponentType, Action } from 'src/services/ophan'
import {
    ONBOARDING_TITLE,
    ONBOARDING_SUBTITLE,
    EXPLAINER_TITLE,
    EXPLAINER_SUBTITLE,
    FREE_TRIAL
} from 'src/helpers/words'

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
        title={ONBOARDING_TITLE}
        subtitle={ONBOARDING_SUBTITLE}
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
        explainerTitle={EXPLAINER_TITLE}
        explainerSubtitle={EXPLAINER_SUBTITLE}
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
                        {FREE_TRIAL}
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
