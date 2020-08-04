import React, { useEffect, useState } from 'react'
import { OnboardingCard, CardAppearance } from './onboarding/onboarding-card'
import { View, Platform, Linking, StyleSheet } from 'react-native'
import { ModalButton } from './Button/ModalButton'
import { Link } from './link'
import { ButtonAppearance } from './Button/Button'
import { getFont } from 'src/theme/typography'
import { sendComponentEvent, ComponentType, Action } from 'src/services/ophan'
import { Copy } from 'src/helpers/words'
import { fetchEditionMenuEnabledSetting } from 'src/helpers/settings/debug'

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
}) => {
    const [editionsMenuEnabled, setEditionsMenuEnabled] = useState(false)
    useEffect(() => {
        fetchEditionMenuEnabledSetting().then((editionsMenuToggle: boolean) => {
            setEditionsMenuEnabled(editionsMenuToggle)
        })
    }, [])
    return (
        <OnboardingCard
            onDismissThisCard={onDismiss}
            title={Copy.signIn.title}
            subtitle={Copy.signIn.subtitle}
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
            explainerTitle={Copy.signIn.explainerTitle}
            explainerSubtitle={
                editionsMenuEnabled
                    ? Copy.signIn.explainerSubtitleEditions
                    : Copy.signIn.explianerSubtitleDaily
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
                            {Copy.signIn.freeTrial}
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
}

export { SignInModalCard }
