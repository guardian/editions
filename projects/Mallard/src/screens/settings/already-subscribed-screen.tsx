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
import {
    ALREADY_SUBSCRIBED_SIGN_IN_TITLE,
    ALREADY_SUBSCRIBED_SUBSCRIBER_ID_TITLE,
    ALREADY_SUBSCRIBED_RESTORE_IAP_TITLE,
    ALREADY_SUBSCRIBED_RESTORE_ERROR_TITLE,
    ALREADY_SUBSCRIBED_RESTORE_ERROR_SUBTITLE,
    ALREADY_SUBSCRIBED_RESTORE_MISSING_TITLE,
    ALREADY_SUBSCRIBED_RESTORE_MISSING_SUBTITLE,
} from 'src/helpers/words'

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
                    data={
                        !canAccess
                            ? [
                                  {
                                      key: 'Sign in to activate',
                                      title: {
                                          ALREADY_SUBSCRIBED_SIGN_IN_TITLE,
                                      },
                                      onPress: () => {
                                          navigation.navigate(routeNames.SignIn)
                                      },
                                      proxy: rightChevronIcon,
                                      linkWeight: 'regular',
                                  },
                                  {
                                      key: 'Activate with subscriber ID',
                                      title: {
                                          ALREADY_SUBSCRIBED_SUBSCRIBER_ID_TITLE,
                                      },
                                      onPress: () => {
                                          navigation.navigate(
                                              routeNames.CasSignIn,
                                          )
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
                            data={[
                                {
                                    key: 'Restore App Store subscription',
                                    title: ALREADY_SUBSCRIBED_RESTORE_IAP_TITLE,
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
                                                    title={
                                                        ALREADY_SUBSCRIBED_RESTORE_ERROR_TITLE
                                                    }
                                                    subtitle={
                                                        ALREADY_SUBSCRIBED_RESTORE_ERROR_SUBTITLE
                                                    }
                                                    close={close}
                                                    onTryAgain={authIAP}
                                                />
                                            ))
                                        } else {
                                            open(close => (
                                                <MissingIAPModalCard
                                                    title={
                                                        ALREADY_SUBSCRIBED_RESTORE_MISSING_TITLE
                                                    }
                                                    subtitle={
                                                        ALREADY_SUBSCRIBED_RESTORE_MISSING_SUBTITLE
                                                    }
                                                    close={close}
                                                    onTryAgain={authIAP}
                                                />
                                            ))
                                        }
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
