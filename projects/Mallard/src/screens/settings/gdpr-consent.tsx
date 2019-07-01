import React from 'react'
import { View } from 'react-native'
import { Row, Separator, Heading } from 'src/components/layout/list/row'
import { Switch, FlatList } from 'react-native-gesture-handler'
import { useSettings } from 'src/hooks/use-settings'

interface GdprSwitch {
    name: string
    description: string
    value: boolean
    setter: (value: boolean) => void
}

const GdprConsent = () => {
    const [settings, setSetting] = useSettings()
    const { gdprAllowGoogleAnalytics } = settings

    const switches: GdprSwitch[] = [
        {
            name: 'Google Analytics (NOT IN USE)',
            description: 'Basic tracking used to give you a better experience',
            value: gdprAllowGoogleAnalytics,
            setter: value => {
                setSetting('gdprAllowGoogleAnalytics', value)
            },
        },
    ]

    return (
        <View>
            <Heading>Your privacy</Heading>
            <FlatList
                ItemSeparatorComponent={Separator}
                ListFooterComponent={Separator}
                ListHeaderComponent={Separator}
                data={switches}
                renderItem={({ item }) => (
                    <Row
                        title={item.name}
                        explainer={item.description}
                        proxy={
                            <Switch
                                value={item.value}
                                onValueChange={() => {
                                    item.setter(!item.value)
                                }}
                            />
                        }
                    ></Row>
                )}
            />
        </View>
    )
}

export { GdprConsent }
