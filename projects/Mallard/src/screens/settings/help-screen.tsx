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
    DIAGNOSTICS_TITLE,
} from 'src/helpers/words'
import { AccessContext } from 'src/authentication/AccessContext'
import { useApolloClient } from '@apollo/react-hooks'
import { useToast } from 'src/hooks/use-toast'

export interface OnCompletionToast {
    (msg: string): void
}

const HelpScreen = ({ navigation }: NavigationInjectedProps) => {
    const { showToast } = useToast()
    const { attempt } = useContext(AccessContext)
    const client = useApolloClient()

    const showToastCallback: OnCompletionToast = (msg: string) => {
        showToast(msg)
    }

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
                            DIAGNOSTICS_TITLE,
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
                            showToastCallback,
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
