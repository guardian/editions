import React from 'react'
import { NavigationScreenProp } from 'react-navigation'
import { EditionsMenu } from 'src/components/EditionsMenu/EditionsMenu'
import { EditionsMenuScreenHeader } from 'src/components/layout/header/header'
import { routeNames } from 'src/navigation/routes'
import { WithAppAppearance } from 'src/theme/appearance'
import { ApiState } from './settings/api-screen'

export const EditionsMenuScreen = ({
    navigation,
}: {
    navigation: NavigationScreenProp<{}>
}) => {
    return (
        <WithAppAppearance value="default">
            <EditionsMenuScreenHeader
                leftActionPress={() => navigation.navigate(routeNames.Issue)}
            />

            <EditionsMenu navigation={navigation} />
            <ApiState />
        </WithAppAppearance>
    )
}
