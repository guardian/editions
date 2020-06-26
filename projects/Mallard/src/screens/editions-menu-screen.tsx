import React, { ReactElement } from 'react'
import { NavigationScreenProp } from 'react-navigation'
import { EditionsMenu } from 'src/components/EditionsMenu/EditionsMenu'
import { EditionsMenuScreenHeader } from 'src/components/layout/header/header'
import { routeNames } from 'src/navigation/routes'
import { WithAppAppearance } from 'src/theme/appearance'
import { ApiState } from './settings/api-screen'
import { View, StyleSheet } from 'react-native'

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
    return (
        <WithAppAppearance value="default">
            <ScreenFiller>
                <>
                    <EditionsMenuScreenHeader
                        leftActionPress={() =>
                            navigation.navigate(routeNames.Issue)
                        }
                    />

                    <EditionsMenu navigation={navigation} />
                    <ApiState />
                </>
            </ScreenFiller>
        </WithAppAppearance>
    )
}
