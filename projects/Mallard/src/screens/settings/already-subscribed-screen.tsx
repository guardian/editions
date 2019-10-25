import React, { useContext } from 'react'
import { List } from 'src/components/lists/list'
import { Heading } from 'src/components/layout/ui/row'
import { NavigationInjectedProps } from 'react-navigation'
import { ScrollContainer } from 'src/components/layout/ui/container'
import { routeNames } from 'src/navigation/routes'
import { WithAppAppearance } from 'src/theme/appearance'
import { RightChevron } from 'src/components/icons/RightChevron'
import { Platform, Text } from 'react-native'
import { AccessContext, useAccess } from 'src/authentication/AccessContext'
import { useModal } from 'src/components/modal'
import { isValid, isError } from 'src/authentication/lib/Attempt'
import { MissingIAPModalCard } from 'src/components/missing-iap-modal-card'
import { SubFoundModalCard } from 'src/components/sub-found-modal-card'

const AlreadySubscribedScreen = ({ navigation }: NavigationInjectedProps) => {
    const canAccess = useAccess()
    const { authIAP } = useContext(AccessContext)
    const { open } = useModal()

    const rightChevronIcon = <RightChevron />

    return (
        <WithAppAppearance value={'settings'}>
            <ScrollContainer>
                <Heading>{`Guardian digital subscription/Digital + Print`}</Heading>
                <List
                    onPress={({ onPress }) => onPress()}
                    data={
                        !canAccess
                            ? [
                                  {
                                      key: 'Sign in to activate',
                                      title: 'Sign in to activate',
                                      data: {
                                          onPress: () => {
                                              navigation.navigate(
                                                  routeNames.SignIn,
                                              )
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
                              ]
                            : []
                    }
                />
                {Platform.OS === 'ios' ? (
                    <>
                        <Heading>{``}</Heading>
                        <Heading>{`Daily Edition`}</Heading>
                        <List
                            onPress={({ onPress }) => onPress()}
                            data={[
                                {
                                    key: 'Restore App Store subscription',
                                    title: 'Restore App Store subscription',
                                    data: {
                                        onPress: async () => {
                                            const {
                                                accessAttempt,
                                            } = await authIAP()
                                            if (isValid(accessAttempt)) {
                                                open(close => (
                                                    <SubFoundModalCard
                                                        close={close}
                                                    />
                                                ))
                                            } else if (isError(accessAttempt)) {
                                                open(close => (
                                                    <MissingIAPModalCard
                                                        title="Verification error"
                                                        subtitle="There was a problem whilst verifying your subscription"
                                                        close={close}
                                                        onTryAgain={authIAP}
                                                    />
                                                ))
                                            } else {
                                                open(close => (
                                                    <MissingIAPModalCard
                                                        title="Subscription not found"
                                                        subtitle="We were unable to find a subscription associated with your Apple ID"
                                                        close={close}
                                                        onTryAgain={authIAP}
                                                    />
                                                ))
                                            }
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
