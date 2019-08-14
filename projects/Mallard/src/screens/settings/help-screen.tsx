import React from 'react'
import { List } from 'src/components/lists/list'
import { NavigationInjectedProps } from 'react-navigation'
import { ScrollContainer } from 'src/components/layout/ui/container'
import { routeNames } from 'src/navigation'
import { WithAppAppearance } from 'src/theme/appearance'
import { RightChevron } from 'src/components/icons/RightChevron'

const HelpScreen = ({ navigation }: NavigationInjectedProps) => {
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
            </ScrollContainer>
        </WithAppAppearance>
    )
}

export { HelpScreen }
