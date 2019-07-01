import React from 'react'
import { View, StyleSheet, ScrollView, FlatList } from 'react-native'
import {
    TappableRow,
    Separator,
    Heading,
    Footer,
} from 'src/components/layout/ui/row'
import { useSettings, useGdprSwitches } from 'src/hooks/use-settings'
import { container } from 'src/theme/styles'
import { GdprSwitchSetting } from 'src/helpers/settings'
import { ThreeWaySwitch } from 'src/components/layout/ui/switch'
import { Button } from 'src/components/button/button'

const styles = StyleSheet.create({
    container,
})

interface GdprSwitch {
    name: string
    description: string
    value: GdprSwitchSetting
    setter: (value: boolean) => void
}

const GdprConsent = () => {
    const [
        { gdprAllowPerformance, gdprAllowTracking, isUsingProdDevtools },
        setSetting,
    ] = useSettings()
    const { DEVMODE_resetAll } = useGdprSwitches()
    const switches: GdprSwitch[] = [
        {
            name: 'Performance (NOT IN USE)',
            description: 'Basic tracking used to give you a better experience',
            value: gdprAllowPerformance,
            setter: value => {
                setSetting('gdprAllowPerformance', value)
            },
        },
        {
            name: 'Tracking (NOT IN USE)',
            description: 'Basic tracking used to give you a better experience',
            value: gdprAllowTracking,
            setter: value => {
                setSetting('gdprAllowTracking', value)
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
                keyExtractor={item => item.description + item.name}
                renderItem={({ item }) => (
                    <TappableRow
                        title={item.name}
                        explainer={item.description}
                        onPress={() => {
                            item.setter(!item.value)
                        }}
                        proxy={<ThreeWaySwitch value={item.value} />}
                    ></TappableRow>
                )}
            />
            {isUsingProdDevtools ? (
                <Footer>
                    <Button onPress={DEVMODE_resetAll}>Reset</Button>
                </Footer>
            ) : null}
        </View>
    )
}

const GdprConsentScreen = () => (
    <ScrollView style={styles.container}>
        <GdprConsent></GdprConsent>
    </ScrollView>
)

export { GdprConsent, GdprConsentScreen }
