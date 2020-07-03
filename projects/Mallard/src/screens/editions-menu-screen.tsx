import { useApolloClient } from '@apollo/react-hooks'
import React, { ReactElement } from 'react'
import { StyleSheet, View } from 'react-native'
import { NavigationScreenProp } from 'react-navigation'
import { Edition, editions } from 'src/common'
import { EditionsMenu } from 'src/components/EditionsMenu/EditionsMenu'
import { EditionsMenuScreenHeader } from 'src/components/layout/header/header'
import { setEdition } from 'src/helpers/settings/setters'
import { useEdition } from 'src/hooks/use-settings'
import { routeNames } from 'src/navigation/routes'
import { WithAppAppearance } from 'src/theme/appearance'
import { ApiState } from './settings/api-screen'

const styles = StyleSheet.create({
    screenFiller: {
        flex: 1,
        backgroundColor: 'white',
    },
})

const ScreenFiller = ({ children }: { children: ReactElement }) => (
    <View style={styles.screenFiller}>{children}</View>
)

export const EditionsMenuScreen = ({
    navigation,
}: {
    navigation: NavigationScreenProp<{}>
}) => {
    const edition = useEdition()
    const client = useApolloClient()

    return (
        <WithAppAppearance value="default">
            <ScreenFiller>
                <>
                    <EditionsMenuScreenHeader
                        leftActionPress={() =>
                            navigation.navigate(routeNames.Issue)
                        }
                    />

                    <EditionsMenu
                        navigationPress={() =>
                            navigation.navigate(routeNames.Issue)
                        }
                        selectedEdition={(edition as Edition) || editions.daily}
                        storeSelectedEdition={(edition: Edition) =>
                            setEdition(client, edition)
                        }
                    />
                    <ApiState />
                </>
            </ScreenFiller>
        </WithAppAppearance>
    )
}
