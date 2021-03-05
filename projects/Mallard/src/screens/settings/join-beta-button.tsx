import React from 'react'
import { Heading } from 'src/components/layout/ui/row'
import { List } from 'src/components/lists/list'
import { UiBodyCopy } from 'src/components/styled-text'
import { Linking, StyleSheet } from 'react-native'
import { JOIN_BETA_LINK } from 'src/constants'
import { isInBeta } from 'src/helpers/release-stream'
import { remoteConfigService } from 'src/services/remote-config'
import { metrics } from 'src/theme/spacing'
import { RightChevron } from 'src/components/icons/RightChevron'
import { routeNames } from 'src/navigation/routes'
import { Copy } from 'src/helpers/words'
import {
    NavigationProp,
    ParamListBase,
    useNavigation,
} from '@react-navigation/native'

const betaButtonStyle = StyleSheet.create({
    thanksText: {
        marginTop: metrics.vertical,
        marginLeft: metrics.horizontal,
    },
})

const betaProgrammeFAQs = (navigation: NavigationProp<ParamListBase>) => {
    return {
        key: 'Beta Programme FAQs',
        title: Copy.settings.betaProgrammeFAQs,
        onPress: () => {
            navigation.navigate(routeNames.BetaProgrammeFAQs)
        },
        proxy: <RightChevron />,
    }
}

const betaThanks = () => {
    const navigation = useNavigation()

    return (
        <>
            <Heading>{``}</Heading>
            <List data={[betaProgrammeFAQs(navigation)]}></List>
            <UiBodyCopy style={betaButtonStyle.thanksText}>
                Thank you for being a beta tester 🙌
            </UiBodyCopy>
            <Heading>{``}</Heading>
        </>
    )
}

const joinBetaMenuButton = () => {
    const navigation = useNavigation()

    return (
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
                        proxy: <RightChevron />,
                    },
                    betaProgrammeFAQs(navigation),
                ]}
            />
            <Heading>{``}</Heading>
        </>
    )
}

const BetaButtonOption = () => {
    if (remoteConfigService.getBoolean('join_beta_button_enabled')) {
        return isInBeta() ? betaThanks() : joinBetaMenuButton()
    } else {
        return <></>
    }
}

export { BetaButtonOption }
