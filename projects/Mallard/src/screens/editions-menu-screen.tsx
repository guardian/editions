import React, { ReactElement } from 'react'
import { StyleSheet, View } from 'react-native'
import DeviceInfo from 'react-native-device-info'
import { EditionsMenu } from 'src/components/EditionsMenu/EditionsMenu'
import { EditionsMenuScreenHeader } from 'src/components/ScreenHeader/EditionMenuScreenHeader'
import { useEditions } from 'src/hooks/use-edition-provider'
import { routeNames } from 'src/navigation/routes'
import { WithAppAppearance } from 'src/theme/appearance'
import { ApiState } from './settings/api-screen'
import { sidebarWidth } from 'src/navigation/navigators/sidebar/positions'
import { useNavigation } from '@react-navigation/native'

const styles = StyleSheet.create({
    screenFiller: {
        flex: 1,
        backgroundColor: 'white',
        maxWidth: DeviceInfo.isTablet() ? sidebarWidth : undefined,
    },
})

export const ScreenFiller = ({
    direction,
    children,
}: {
    direction?: string
    children: ReactElement
}) => (
    <View
        style={[
            styles.screenFiller,
            direction === 'end' && { alignSelf: 'flex-end' },
        ]}
    >
        {children}
    </View>
)

export const EditionsMenuScreen = () => {
    const navigation = useNavigation()
    const {
        editionsList: { regionalEditions, specialEditions },
        selectedEdition,
        storeSelectedEdition,
    } = useEditions()

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
                        regionalEditions={regionalEditions}
                        specialEditions={specialEditions}
                        selectedEdition={selectedEdition.edition}
                        storeSelectedEdition={storeSelectedEdition}
                    />
                    <ApiState />
                </>
            </ScreenFiller>
        </WithAppAppearance>
    )
}
