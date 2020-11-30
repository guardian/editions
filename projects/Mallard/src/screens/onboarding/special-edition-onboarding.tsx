import React from 'react'
import { StyleSheet, View } from 'react-native'
import {
    OnboardingCard,
    CardAppearance,
} from 'src/components/onboarding/onboarding-card'
import { ButtonAppearance } from 'src/components/Button/Button'
import { ModalButton } from 'src/components/Button/ModalButton'
import { LinkNav } from 'src/components/link'
import {
    gdprSwitchSettings,
    CURRENT_CONSENT_VERSION,
} from 'src/helpers/settings'
import { GDPR_SETTINGS_FRAGMENT } from 'src/helpers/settings/resolvers'
import {
    setGdprFlag,
    setGdprConsentVersion,
} from 'src/helpers/settings/setters'
import { useQuery } from 'src/hooks/apollo'
import gql from 'graphql-tag'
import { Copy } from 'src/helpers/words'
import { TitlepieceText } from 'src/components/styled-text'

const styles = StyleSheet.create({
    consentButtonContainer: {
        display: 'flex',
        flexDirection: 'row',
        alignItems: 'center',
    },
})

const OnboardingSpecialEdition = ({}: {}) => {
    return (
        <View>
            <TitlepieceText>Gal-dem-takeover</TitlepieceText>
        </View>
    )
}

export { OnboardingSpecialEdition }
