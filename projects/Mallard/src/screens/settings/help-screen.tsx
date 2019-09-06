import React, { useContext } from 'react'
import { List } from 'src/components/lists/list'
import { NavigationInjectedProps } from 'react-navigation'
import { ScrollContainer } from 'src/components/layout/ui/container'
import { routeNames } from 'src/navigation/routes'
import { WithAppAppearance } from 'src/theme/appearance'
import { RightChevron } from 'src/components/icons/RightChevron'
import { Heading } from 'src/components/layout/ui/row'
import { AuthContext } from 'src/authentication/auth-context'
import { createSupportMailTo } from 'src/helpers/diagnostics'

const HelpScreen = ({ navigation }: NavigationInjectedProps) => {
    const { status } = useContext(AuthContext)
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
                        createSupportMailTo(
                            'Report an issue',
                            'apps.feedback@theguardian.com',
                            status,
                        ),
                        createSupportMailTo(
                            'Subscription, payment and billing issues',
                            'subscriptions@theguardian.com',
                            status,
                        ),
                        createSupportMailTo(
                            'Comment or query about an article',
                            'guardian.readers@theguardian.com',
                            status,
                        ),
                        createSupportMailTo(
                            'Send feedback',
                            'apps.feedback@theguardian.com',
                            status,
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
