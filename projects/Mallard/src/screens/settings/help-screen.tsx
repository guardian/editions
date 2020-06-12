import React, { useContext } from 'react'
import { List } from 'src/components/lists/list'
import { NavigationInjectedProps } from 'react-navigation'
import { ScrollContainer } from 'src/components/layout/ui/container'
import { routeNames } from 'src/navigation/routes'
import { WithAppAppearance } from 'src/theme/appearance'
import { RightChevron } from 'src/components/icons/RightChevron'
import { Heading } from 'src/components/layout/ui/row'
import {
    createSupportMailto,
    copyDiagnosticInfo,
} from 'src/helpers/diagnostics'
import {
    ISSUE_EMAIL,
    SUBSCRIPTION_EMAIL,
    READERS_EMAIL,
    APPS_FEEDBACK_EMAIL,
} from 'src/helpers/words'
import { AccessContext } from 'src/authentication/AccessContext'
import { useApolloClient } from '@apollo/react-hooks'

const HelpScreen = ({ navigation }: NavigationInjectedProps) => {
    const { attempt } = useContext(AccessContext)
    const client = useApolloClient()
    return (
        <WithAppAppearance value={'settings'}>
            <ScrollContainer>
                <List
                    data={[
                        {
                            key: 'Frequently Asked Questions',
                            title: 'Frequently Asked Questions',
                            onPress: () => {
                                navigation.navigate(routeNames.FAQ)
                            },
                            proxy: <RightChevron />,
                        },
                    ]}
                />
                <Heading>Contact us</Heading>
                <List
                    data={[
                        createSupportMailto(
                            client,
                            'Report an issue',
                            ISSUE_EMAIL,
                            attempt,
                        ),
                        createSupportMailto(
                            client,
                            'Subscription, payment and billing issues',
                            SUBSCRIPTION_EMAIL,
                            attempt,
                        ),
                        createSupportMailto(
                            client,
                            'Comment or query about an article',
                            READERS_EMAIL,
                            attempt,
                        ),
                        createSupportMailto(
                            client,
                            'Send feedback',
                            APPS_FEEDBACK_EMAIL,
                            attempt,
                        ),
                    ]}
                />
                <Heading>Diagnostics</Heading>
                <List
                    data={[
                        copyDiagnosticInfo(
                            client,
                            'Copy diagnostic information',
                            attempt,
                        ),
                    ]}
                />
            </ScrollContainer>
        </WithAppAppearance>
    )
}

HelpScreen.navigationOptions = {
    title: 'Help',
}

export { HelpScreen }
