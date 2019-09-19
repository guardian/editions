import React, { useContext } from 'react'
import { List } from 'src/components/lists/list'
import { Heading } from 'src/components/layout/ui/row'
import { NavigationInjectedProps } from 'react-navigation'
import { ScrollContainer } from 'src/components/layout/ui/container'
import { routeNames } from 'src/navigation/routes'
import { WithAppAppearance } from 'src/theme/appearance'
import { RightChevron } from 'src/components/icons/RightChevron'
import { AuthContext, useAuth } from 'src/authentication/auth-context'
import { Platform, Text } from 'react-native'

const AlreadySubscribedScreen = ({ navigation }: NavigationInjectedProps) => {
    const authHandler = useAuth()
    const { restorePurchases, isRestoring } = useContext(AuthContext)

    const rightChevronIcon = <RightChevron />

    const restoringLabel = isRestoring
        ? 'Restoring ...'
        : 'Restore App Store subscription'

    return (
        <WithAppAppearance value={'settings'}>
            <ScrollContainer>
                <Heading>{`Guardian Digital pack/Digital + Print`}</Heading>
                <List
                    onPress={({ onPress }) => onPress()}
                    data={authHandler({
                        pending: () => [],
                        authed: () => [],
                        unauthed: () => [
                            {
                                key: 'Sign in to activate',
                                title: 'Sign in to activate',
                                data: {
                                    onPress: () => {
                                        navigation.navigate(routeNames.SignIn)
                                    },
                                },
                                proxy: rightChevronIcon,
                                linkWeight: 'regular',
                            },
                            {
                                key: 'Activate with subscriber ID',
                                title: 'Activate with subscriber ID',
                                data: {
                                    onPress: () => {
                                        navigation.navigate(
                                            routeNames.CasSignIn,
                                        )
                                    },
                                },
                                proxy: rightChevronIcon,
                                linkWeight: 'regular',
                            },
                        ],
                    })}
                />
                {Platform.OS === 'ios' ? (
                    <>
                        <Heading>{``}</Heading>
                        <Heading>{`Daily Edition`}</Heading>
                        <List
                            onPress={({ onPress }) => onPress()}
                            data={[
                                {
                                    key: restoringLabel,
                                    title: restoringLabel,
                                    data: {
                                        onPress: () => {
                                            restorePurchases()
                                        },
                                    },
                                    proxy: rightChevronIcon,
                                    linkWeight: 'regular',
                                },
                            ]}
                        />
                    </>
                ) : (
                    <></>
                )}
            </ScrollContainer>
        </WithAppAppearance>
    )
}

AlreadySubscribedScreen.navigationOptions = {
    title: <Text style={{ fontSize: 20 }}>Subscription Activation</Text>,
}

export { AlreadySubscribedScreen }
