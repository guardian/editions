import React from 'react'
import { View, StyleSheet, ScrollView, Switch, FlatList } from 'react-native'
import { Row, Separator, Heading } from 'src/components/layout/list/row'
import { useSettings } from 'src/hooks/use-settings'
import { container } from 'src/theme/styles'
import { GdprSwitchSettings } from 'src/helpers/settings'

const styles = StyleSheet.create({
    container,
})

const gdprRelatedSwitches: (keyof GdprSwitchSettings)[] = [
    'gdprAllowGoogleAnalytics',
]

interface GdprSwitch {
    name: string
    description: string
    value: boolean
    setter: (value: boolean) => void
}

export const useGdprSwitches = () => {
    const [, setSetting] = useSettings()

    const enableEverything = () => {
        gdprRelatedSwitches.map(sw => {
            setSetting(sw, true)
        })
    }

    return { enableEverything }
}

const GdprConsent = () => {
    const [{ gdprAllowGoogleAnalytics }, setSetting] = useSettings()

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

const GdprConsentScreen = () => (
    <ScrollView style={styles.container}>
        <GdprConsent></GdprConsent>
    </ScrollView>
)

export { GdprConsent, GdprConsentScreen }
