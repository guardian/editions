import React from 'react'
import { Heading } from 'src/components/layout/ui/row'
import { List } from 'src/components/lists/list'
import { UiBodyCopy } from 'src/components/styled-text'
import { Linking, StyleSheet } from 'react-native'
import { JOIN_BETA_LINK } from 'src/constants'
import { isInBeta } from 'src/helpers/release-stream'
import { remoteConfigService } from 'src/services/remote-config'
import { metrics } from 'src/theme/spacing'

const betaButtonStyle = StyleSheet.create({
    thanksText: {
        marginTop: metrics.vertical,
        marginLeft: metrics.horizontal,
    },
})

const betaThanks = () => (
    <>
        <UiBodyCopy style={betaButtonStyle.thanksText}>
            Thank you for being a beta tester 🙌
        </UiBodyCopy>
        <Heading>{``}</Heading>
    </>
)

const joinBetaMenuButton = () => (
    <>
        <Heading>{``}</Heading>
        <List
            data={[
                {
                    key: 'Become a beta tester 🙌',
                    title: 'Become a beta tester 🙌',
                    onPress: () => {
                        Linking.openURL(JOIN_BETA_LINK) //what to catch here?
                    },
                },
            ]}
        />
        <Heading>{``}</Heading>
    </>
)

const BetaButtonOption = () => {
    if (remoteConfigService.getBoolean('join_beta_button_enabled')) {
        return isInBeta() ? betaThanks() : joinBetaMenuButton()
    } else {
        return <></>
    }
}

export { BetaButtonOption }
