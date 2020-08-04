import React from 'react'
import { Heading } from 'src/components/layout/ui/row'
import { List } from 'src/components/lists/list'
import { Linking } from 'react-native'
import { JOIN_BETA_LINK } from 'src/constants'
import { isInBeta } from 'src/helpers/release-stream'
import remoteConfig from '@react-native-firebase/remote-config'

const betaThanks = () => (
    <>
        <Heading>{``}</Heading>
        <Heading>Thank you for being a beta tester 🙌</Heading>
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
    if (!!remoteConfig().getValue('join_beta_button_enabled').value) {
        return isInBeta() ? betaThanks() : joinBetaMenuButton()
    } else {
        return <></>
    }
}

export { BetaButtonOption }
