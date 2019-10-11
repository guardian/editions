import React, { useContext } from 'react'
import { List } from 'src/components/lists/list'
import { NavigationInjectedProps } from 'react-navigation'
import { ScrollContainer } from 'src/components/layout/ui/container'
import { routeNames } from 'src/navigation/routes'
import { WithAppAppearance } from 'src/theme/appearance'
import { RightChevron } from 'src/components/icons/RightChevron'
import { Heading } from 'src/components/layout/ui/row'
import { createSupportMailto } from 'src/helpers/diagnostics'
import {
    ISSUE_EMAIL,
    SUBSCRIPTION_EMAIL,
    READERS_EMAIL,
    APPS_FEEDBACK_EMAIL,
} from 'src/helpers/words'
import { AccessContext } from 'src/authentication/AccessContext'

const HelpScreen = ({ navigation }: NavigationInjectedProps) => {
    const { attempt } = useContext(AccessContext)
    return (
        <WithAppAppearance value={'settings'}>
            <ScrollContainer>
                <List
                    onPress={({ onPress }) => onPress()}
                    data={[
                        {
                            key: 'Frequently Asked Questions',
                            title: 'Frequently Asked Questions',
                            data: {
                                onPress: () => {
                                    navigation.navigate(routeNames.FAQ)
                                },
                            },
                            proxy: <RightChevron />,
                        },
                    ]}
                />
                <Heading>Contact us</Heading>
                <List
                    onPress={({ onPress }) => onPress()}
                    data={[
                        createSupportMailto(
                            'Report an issue',
                            ISSUE_EMAIL,
                            attempt,
                        ),
                        createSupportMailto(
                            'Subscription, payment and billing issues',
                            SUBSCRIPTION_EMAIL,
                            attempt,
                        ),
                        createSupportMailto(
                            'Comment or query about an article',
                            READERS_EMAIL,
                            attempt,
                        ),
                        createSupportMailto(
                            'Send feedback',
                            APPS_FEEDBACK_EMAIL,
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
