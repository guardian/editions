import React from 'react'
import { OnboardingCard, CardAppearance } from './onboarding/onboarding-card'
import { ModalButton } from './Button/ModalButton'
import {
    SUB_NOT_FOUND_EXPLAINER_SUBTITLE,
    SUB_NOT_FOUND_TITLE,
    SUB_NOT_FOUND_EXPLAINER,
    SUB_NOT_FOUND_SUBSCRIBER_ID_BUTTON,
    SUB_NOT_FOUND_SIGN_IN,
} from 'src/helpers/words'

const SubNotFoundModalCard = ({
    close,
    onOpenCASLogin,
    onLoginPress,
    onDismiss,
}: {
    close: () => void
    onOpenCASLogin: () => void
    onLoginPress: () => void
    onDismiss: () => void
}) => (
    <OnboardingCard
        title={SUB_NOT_FOUND_TITLE}
        appearance={CardAppearance.blue}
        size="small"
        explainerTitle={SUB_NOT_FOUND_EXPLAINER}
        onDismissThisCard={() => {
            close()
            onDismiss()
        }}
        explainerSubtitle={SUB_NOT_FOUND_EXPLAINER_SUBTITLE}
        bottomContent={
            <>
                <ModalButton
                    onPress={() => {
                        close()
                        onLoginPress()
                    }}
                >
                    {SUB_NOT_FOUND_SIGN_IN}
                </ModalButton>
                <ModalButton
                    onPress={() => {
                        close()
                        onOpenCASLogin()
                    }}
                >
                    {SUB_NOT_FOUND_SUBSCRIBER_ID_BUTTON}
                </ModalButton>
            </>
        }
        bottomExplainerContent={
            <>
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
    ></OnboardingCard>
)

export { SubNotFoundModalCard }
